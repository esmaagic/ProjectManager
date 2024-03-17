const User = require('../models/User')
const Project = require('../models/Project')
const Task = require('../models/Task')




exports.createProject = async (req,res) =>{

   let user = await User.findById(req.session.user._id)

    const {project_name, description,end_date, managerUsername } = req.body


    let adminId = user.position === 1 ? user._id : user.admin_id

    try{
        const project = new Project({
                project_name,
                description,
                end_date,
                admin_id: adminId
            }
        )
        if(user.position === 2){
            project.manager = user._id
            const admin = await User.findById(adminId)
            admin.managing_projects.push(project._id)
            await admin.save()
        }
        else if(user.position === 1 ){
            const projectManager = await User.findOne({username: managerUsername})
            project.manager = projectManager._id
            projectManager.managing_projects.push(project._id)
            await projectManager.save()
        }
        user.managing_projects.push(project._id)
        await project.save()
        await user.save()


        //res.redirect('/supervisors/getSupervisorPan')
        res.status(200).send('Project created')
    }catch (err){
        console.error(err);
        res.status(500).send('Error creating project')
    }
}

exports.deleteProject = async (req,res) =>{
    const projectId = req.params.projectId;

    try {
        // Find the project by ID
        const project = await Project.findById(projectId);
        const projectManagerId = project.manager
        const projectManager = await User.findById(projectManagerId)
        const projectMembers = project.members

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Remove the project's tasks from each user's tasks array
        /*for (const memberId of project.members) {
            await User.updateOne(
                { _id: memberId },
                { $pull: { tasks: { $in: project.tasks } } }
            );
        }*/

        await User.updateMany(
            { _id: { $in: project.members } },
            { $pull: { tasks: { $in: project.tasks } } }
        );


        // Remove the project from each user's projects array
        await User.updateMany(
            { _id: { $in: project.members } },
            { $pull: { projects: projectId } }
        );

        // Remove the project from project admin's projects array
        await User.updateOne(
            { _id: project.admin_id },
            { $pull: { managing_projects: projectId } }
        );

        //Remove project from managers managing_projects array
        await User.updateOne(
            { _id: project.manager},
            { $pull: { managing_projects: projectId}}
        )



        // Delete all tasks associated with the project
        await Task.deleteMany({ _id: { $in: project.tasks } });

        // Delete the project itself
        await Project.findByIdAndDelete(projectId);



        //update hierarchy

        for(let thisUser of projectMembers){
            thisUser = await User.findById(thisUser)
            let intersection = thisUser.projects.some(item => projectManager.managing_projects.includes(item))
            if(!intersection){
                thisUser.supervisors.pull(projectManagerId)
                projectManager.subordinates.pull(thisUser._id)
                thisUser.save()
                projectManager.save()
            }
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// get controllers
//render all projects of user
exports.getUserProjects = async (req,res)=>{
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId).populate({
            path: 'projects',
            match: { completed: false },
            options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
        });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const projects = user.projects;


        res.render('allProjects',{projects,user})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get all users tasks of given project and render page
exports.getEachProject = async (req,res)=>{
    const {projectId} = req.params

    try {
        //const project = await Project.findById(projectId).populate({path: 'tasks', populate:{path:'members', model:'User'}}).exec()
        //const project = await Project.findById(projectId).populate('tasks').exec()
        const user = await User.findById(req.session.user._id).populate('projects').exec()
        const project = await Project.findById(projectId)

        const tasks = await Task.find({
            project_id: projectId,
            members: { $elemMatch: { $eq: user._id } },
            completed:false
        });

        /*const user2 = await User.findById(req.session.user._id).populate({
            path: 'tasks',
            match: {completed: false, project_id: projectId },
            options: { sort: { end_date: 1 } }
        });*/
        //res.status(200).send({project, user} );

        res.render('eachProject', {project,tasks, user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}





//all projects of user
/*
exports.UserProjectsJson  = async(req,res)=> {
    const userId = req.session.user._id;
    const {isManaging} = req.params
    let populatePath
    if(isManaging === '1')
        populatePath = 'managing_projects'
    else
        populatePath = 'projects'
    try {
        const user = await User.findById(userId).populate({
            path: populatePath,
            match: {completed: false},
            options: {sort: {end_date: 1}},
        });
        let projects = [];
        if(isManaging==='1'){

            for (const project of user.managing_projects) {
                const populatedProject = await Project.findById(project._id).populate('tasks').exec();
                projects.push(populatedProject);
            }
        }else if(isManaging==='0'){

            for (const project of user.projects) {
                const populatedProject = await Project.findById(project._id).populate('tasks').exec();
                projects.push(populatedProject);
            }
        }


        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        //const projects = user.projects;
        res.status(200).json({projects});
        //res.render('allProjects',{projects,user})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
*/



//all projects of user
exports.UserProjectsJson  = async(req,res)=> {
    const userId = req.session.user._id;
    const {isManaging, report} = req.params
    let populatePath
    let isRep = false
    if(isManaging === '1'){
        populatePath = 'managing_projects'
    }
    else{
        populatePath = 'projects'
    }

    try {
        let user
        if(report === '1'){
            user = await User.findById(userId).populate({
                path: populatePath,
                options: {sort: {end_date: 1}},
                populate :[
                    { path: "members", select: "username"},
                    { path: "tasks"}
                ]
            })
        }else{
            user = await User.findById(userId).populate({
                path: populatePath,
                match: {completed: false},
                options: {sort: {end_date: 1}},
                populate :[
                    { path: "members", select: "username"},
                    { path: "tasks"}
                ]
            })
        }




        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        //const projects = user.projects;
        if(isManaging === '1')
            res.status(200).json({projects: user.managing_projects});
        else res.status(200).json({projects: user.projects});
        //res.render('allProjects',{projects,user})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



//get all tasks of given project
exports.getProjectTasks = async(req,res)=>{
    const {projectId} = req.params

    try {
        //const project = await Project.findById(projectId).populate({path: 'tasks', populate:{path:'members', model:'User'}}).exec()

        const project = await Project.findById(projectId).populate('tasks').exec()
        const user = await User.findById(req.session.user._id)

        res.status(200).send({project, user} );




    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get all behind projects of user or managing projects of manager
exports.getBehindProjects = async (req,res)=>{
    const userId = req.session.user._id;
    const {isManaging} = req.params
    try {
        let user
        if(isManaging==='0'){
             user = await User.findById(userId).populate({
                path: 'projects',
                match: { end_date: { $lt: new Date() }, completed: false },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });
        }else if(isManaging==='1'){
             user = await User.findById(userId).populate({
                path: 'managing_projects',
                match: { end_date: { $lt: new Date() }, completed: false },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });

        }




        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const projects = isManaging === '1' ? user.managing_projects : user.projects
        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get all completed projects of user or managing projects of manager
exports.getCompletedProjects = async (req,res)=>{
    const userId = req.session.user._id;
    const {isManaging} = req.params
    try {



        let user
        if(isManaging==='0'){
             user = await User.findById(userId).populate({
                path: 'projects',
                match: { completed: true },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });
        }else if(isManaging==='1'){
             user = await User.findById(userId).populate({
                path: 'managing_projects',
                match: { completed: true },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });

        }




        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const projects = isManaging === '1' ? user.managing_projects : user.projects
        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.markProjectAsCompleted = async(req,res) =>{
    const {projectId} = req.params
    try {
        // Find the project by ID and update the completed field
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: { completed: true } },
            { new: true } // Return the modified document
        );
        await Task.updateMany(
            { project_id: projectId },
            { $set: { completed: true } }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project marked as completed', project: updatedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
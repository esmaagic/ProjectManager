const User = require('../models/User')
const Project = require('../models/Project')
const Task = require('../models/Task')

exports.createTask = async (req,res)=>{
    const {task_name, description,start_date, end_date } = req.body

    try{
        const thisProject = await Project.findById(req.params.projectId)

        if (!thisProject) {
            return res.status(404).send('Project not found');
        }
        const task = new Task({
            task_name,
            description,
            start_date,
            project_id: req.params.projectId,
            end_date
        })

        await task.save()

        thisProject.tasks.push(task._id)
        await thisProject.save()

       // res.redirect(`/each-project/${req.params.projectID}`)
        res.send(task)
    }catch (err){
        console.log(err)
    }
}

exports.deleteTask = async (req, res) =>{
    const taskId = req.params.taskId;

    try {
        // Find the task by ID
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Remove the task from each user's tasks array
        await User.updateMany(
            { _id: { $in: task.members } },
            { $pull: { tasks: taskId } }
        );

        // Remove the task from project's tasks array
        await Project.updateOne(
            { _id: task.project_id },
            { $pull: { tasks: taskId } }
        );

        // Remove the task from the task admin's tasks array
        await User.updateOne(
            { _id: req.session.user.admin_id },
            { $pull: { tasks: taskId } }
        );

        // Delete the task itself
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.addMember = async (req, res) => {

    const { username } = req.body;
    console.log('addmember controller')
    console.log(req.body)
    console.log(req.params.taskId)
    try {
        const member = await User.findOne({ username });
        const task = await Task.findById(req.params.taskId);
        const currentProject = await Project.findById(task.project_id);
        const projectManager = await User.findById(currentProject.manager);

        if (member && task && currentProject) {

            const isMemberInTask = task.members.includes(member._id);
            if (isMemberInTask) {
                return res.status(400).send('Member is already associated with the task');
            } else {
                member.tasks.push(task._id);
                await member.save();
                task.members.push(member._id);
                await task.save();
            }

            const isMemberInProject = currentProject.members.includes(member._id);
            if (!isMemberInProject) {
                member.projects.push(currentProject._id);
                currentProject.members.push(member._id);
                await currentProject.save();
            }

            const isSupervisor = member.supervisors.includes(projectManager._id);
            const isSubordinate = projectManager.subordinates.includes(member._id);
            if (!isSupervisor) {
                member.supervisors.push(projectManager._id);
            }
            if (!isSubordinate) {
                projectManager.subordinates.push(member._id);
                await projectManager.save();
            }

            await member.save();
            return res.send('Member added successfully');
        } else {
            return res.status(404).send('Resources not found');
        }
    } catch (err) {
        console.log('Internal server error')
        //console.error(err);
        return res.status(500).send('Internal server error');
    }
};

exports.removeMember = async (req, res) => {
    const { taskId } = req.params;
    const { username }= req.body

    try {
        const member = await User.findOne({username})
        const task = await Task.findById(taskId);
        const project = await Project.findById(task.project_id);


        if (member && task && project) {
            // Remove member from task
            task.members.pull(member._id);
            await task.save();

            // Remove task from member's tasks
            member.tasks.pull(task._id);


            //Remove project from member's projects
            member.projects.pull(project._id);
            await member.save();

            // Remove member from project
            let isMember = false // check if member is in at least one other task of the project
            for (const taskId of member.tasks) {
                try {
                    const task2 = await Task.findById(taskId).populate().exec();
                    if(task2.project_id.toString() === project._id.toString()){
                        isMember = true
                        break
                    }
                } catch (err) {
                    console.error('Error:', err);
                    // Handle error if necessary
                }
            }

            if(!isMember){
                project.members.pull(member._id);

                //update hierarchy
                let isManager=false
                for(let thisProject of member.projects){
                    thisProject = await Project.findById(thisProject)
                    if(thisProject.manager.toString() === project.manager.toString()){
                        isManager = true
                        break
                    }
                }
                if(!isManager){
                    member.supervisors.pull(project.manager)
                    const manager = await User.findById(project.manager)
                    manager.subordinates.pull(member._id)

                    await member.save()
                    await manager.save()
                }


            }
            await project.save();




            return res.send('Member deleted successfully from project and task');
        } else {
            return res.status(404).send('Member, task, or project not found');
        }
    } catch (err) {
        console.log('Error:', err);
        return res.status(500).send('Internal Server Error');
    }



};


exports.getUserTasks = async (req,res)=>{
    const userId = req.session.user._id;
   // const project = await Project.findById(projectId).populate({path: 'tasks', populate:{path:'members', model:'User'}}).exec()
    try {
        const user = await User.findById(userId).populate({
            path: 'tasks',
            match: { completed: false },
            options: { sort: { start_date: 1 }},

        })


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let tasks = [];
        for (const task of user.tasks) {
            const populatedTask = await Task.findById(task._id).populate('project_id');
            tasks.push(populatedTask);
        }
        res.render('allTasks',{tasks, user})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.getManagingTasks = async (req,res)=>{
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId).populate({
            path: 'managing_projects',
            options: { sort: { project_id: 1 } }}).exec()

        const projects= user.managing_projects


        console.log(projects)



        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//all tasks of given project (supervisors)
exports.getThisAllTasks = async(req,res)=>{
    const userId = req.session.user._id;
    const {projectId,report} = req.params

    try {
        let user
        if(report === '1'){
            user = await User.findById(userId).populate({
                path: 'tasks',
                match: { project_id: projectId },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });
        }else{
            user = await User.findById(userId).populate({
                path: 'tasks',
                match: {completed: false, project_id: projectId },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });
        }



        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = user.tasks;
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getThisBehindTasks = async(req,res)=>{
        const userId = req.session.user._id;
        const {projectId} = req.params

        try {
            const user = await User.findById(userId).populate({
                path: 'tasks',
                match: { end_date: { $lt: new Date() }, completed: false, project_id: projectId },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });


            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const tasks = user.tasks;
            res.status(200).json({ tasks });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
}

exports.getThisCompletedTasks = async (req,res)=>{
    const userId = req.session.user._id;
    const {projectId} = req.params

    try {
            const user = await User.findById(userId).populate({
            path: 'tasks',
            match: { completed: true, project_id: projectId },
            options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
        }).exec();


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = user.tasks;
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllManagingTasks = async (req,res) =>{
    try{
        const {report} = req.params
        const user = await User.findById(req.session.user._id)
        let tasks;
        if(report === '1'){
             tasks = await Task.find({
                project_id:  { $in: user.managing_projects }
            }).populate('members')

        }else{
            tasks = await Task.find({
                project_id:  { $in: user.managing_projects },
                completed: false
            }).populate('members')
        }


        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// for  users
exports.getAllTasks = async(req,res)=>{
    const userId = req.session.user._id;
    const {report} = req.params


    try {
        let user
        if(report === '1'){
            user = await User.findById(userId).populate({
                path: 'tasks',
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });
        }else{
            user = await User.findById(userId).populate({
                path: 'tasks',
                match: {completed: false },
                options: { sort: { end_date: 1 } } // Sort projects by end_date in ascending order (1 for ascending, -1 for descending)
            });
        }






        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = user.tasks;
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getBehindTasks = async(req,res)=>{
    const userId = req.session.user._id;
    const {isManaging} = req.params

    try {
        const user = await User.findById(userId).populate({
            path: 'tasks',
            match: { end_date: { $lt: new Date() }, completed: false },
        })
        const managingTasks = await Task.find({
            project_id:  { $in: user.managing_projects },
            end_date: { $lt: new Date() }, completed: false ,
            }).populate('members')

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = isManaging === '0' ? user.tasks : managingTasks
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getCompletedTasks = async (req,res)=>{
    const userId = req.session.user._id;
    const {isManaging} = req.params

    try {
        const user = await User.findById(userId).populate({
            path: 'tasks',
            match: { completed: true },
        }).exec();
        let managingTasks

        if(isManaging==='1'){
            managingTasks= await Task.find({
                project_id:  { $in: user.managing_projects },
                completed: true ,
            }).populate('members')
        }


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = isManaging === '0' ? user.tasks : managingTasks
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.markTaskAsCompleted = async(req,res) =>{
    const taskId = req.params.taskId;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.completed = true;
        await task.save();

        res.status(200).json({ message: 'Task marked as completed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
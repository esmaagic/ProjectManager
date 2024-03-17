const User = require('../models/User')
const Project = require('../models/Project')
const Task = require('../models/Task')
const bcrypt = require('bcryptjs')



exports.createUser = async (req,res)=>{

    try{
        const { username, firstname, lastname, email, position} = req.body
        const admin = await User.findById(req.session.user._id)

        const notValidUsername = await User.findOne({username})
        const notValidEmail = await User.findOne({email})

        if(notValidUsername || notValidEmail){
            req.session.error = "User already exists"
            return res.send(req.session.error) //res.redirect("/adminPan")
        }

        const newPass = "123"
        const hashedPsw = await bcrypt.hash(newPass, 10)

        const user = new User({
                username,
                firstname,
                lastname,
                email,
                password: hashedPsw,
                position,
                admin_id: admin._id
            }
        )

        admin.subordinates.push(user._id)
        await admin.save()

        await user.save()
        //res.redirect("/adminPan")

        res.send(user)
    }catch (err){
        res.send(err)
    }
}

exports.deleteUser = async (req,res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        const userId = user._id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove user from projects
        await Project.updateMany(
            { members: userId },
            { $pull: { members: userId } }
        );


        // Update each project where the manager matches userId to remove manager field
        await Project.updateMany(
            { manager: userId },
            { $set: { manager: null } }
        );


        // Remove user from tasks
        await Task.updateMany(
            { members: userId },
            { $pull: { members: userId } }
        );

        // Update hierarchy
        if(user.position === 2){

            await User.updateMany(
                { supervisors: userId},
                { $pull: { supervisors: userId}}
            )
        }
        if(user.position === 3){
            await User.updateMany(
                { subordinates: userId},
                { $pull: { subordinates: userId}}
            )
        }

        // Remove user
        await User.findByIdAndDelete(userId);

        // Also remove this user from any other related documents (if needed)

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



exports.getAccount = async (req,res)=>{
    const user = await User.findById(req.session.user._id).populate('admin_id').exec()
    res.render('account', {user})
}

exports.getAllUsers = async (req,res)=>{
    const user = await User.findById(req.session.user._id)
    const position = user.position
    let allUsers
    if(position === 1){
        allUsers = await User.find({admin_id: user._id})
            .populate({
                path: 'supervisors',
                select: 'username',
            })
            .populate({
                path: 'subordinates',
                select: 'username',
            })
            .populate({
                path: 'tasks',
                populate: {
                    path: 'project_id',
                    model: 'Project',
                    populate: {
                        path: 'manager',
                        model: 'User'
                    }
                },

            })
            .sort({ username: 1 })
            .exec();
    }

    else{
        let managerId = user._id
        allUsers = await User.find({supervisors:managerId})
            .populate({
                path: 'supervisors',
                select: 'username',
            })
            .populate({
                path: 'subordinates',
                select: 'username',
            })
            .populate({
                path: 'tasks',
                populate: {
                    path: 'project_id',
                    model: 'Project',
                    populate: {
                        path: 'manager',
                        model: 'User'
                    }
                },

            })
            .sort({ username: 1 })
            .exec();
    }

    res.status(200).json({allUsers, position})
}


exports.getUserActivity = async (req,res)=>{
    const user = await User.findById(req.session.user._id)
    const position = user.position
    let allUsers
    if(position === 1){
        allUsers = await User.find({admin_id: user._id, activity: true})
            .sort({ username: 1 })
            .exec();
    }

    else{
        let managerId = user._id
        allUsers = await User.find({supervisors:managerId,activity: true})
            .sort({ username: 1 })
            .exec();
    }

    res.status(200).json({allUsers})
}


exports.changePassword = async (req,res)=>{

    try{
        const { old_password, new_password, confirm_password} = req.body
        if(new_password !== confirm_password){
            res.redirect('/user/account')
        }
        const user = await User.findById(req.session.user._id)

        const isMatch = await bcrypt.compare(old_password, user.password)
        if(!isMatch){
            res.redirect('/user/account')
        }

        user.password = await bcrypt.hash(new_password, 10)
        user.save();
        res.render('login')
    }catch (err){
        res.status(500).json({ error: err.message });
    }
}
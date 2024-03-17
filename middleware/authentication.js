const Task = require('../models/Task')
const Project = require('../models/Project')
const User = require('../models/User')

exports.isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.send('not authenticated')
    }
}

exports.isAdmin= (req,res,next)=>{
    const user = req.session.user
    if(user.position === 1){
        next()
    }else{
        res.send('not authorized')
    }
}

exports.isManager = (req,res,next)=>{
    const user = req.session.user
    if(user.position === 2){
        next()
    }else{
        res.send('not authorized')
    }
}

//check if user is admin or  manager of current project via projectId or taskId
exports.isThisManager = async (req,res,next)=>{
    const user = await User.findById(req.session.user._id)
    let projectId = req.params.projectId

    if(req.params.taskId) {
        const task = await Task.findById(req.params.taskId)
         projectId = task.project_id

    }else if(req.params.projectId){
         projectId = req.params.projectId
    }


    if(user.managing_projects.includes(projectId) || user.position === 1){
        next()
    }else{res.send('not authorized')}


}

exports.isBoth = (req,res,next)=>{
    const user = req.session.user

    if(user.position === 2 || user.position === 1  ){
        next()
    }else{
        res.send('not authorized')
    }
}

//check if user is a member of the task or if user is the manager
exports.logTimeAuth = async (req,res,next)=>{
    const user = await User.findById(req.session.user._id)
    const task = await Task.findById(req.params.taskId)
    const project = await Project.findById(task.project_id)

    if(user.tasks.includes(task._id) || user.managing_projects.includes(project._id)){
        next()
    }else{
        res.send('not authorized')
    }
}
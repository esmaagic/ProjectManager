const Task = require('../models/Task')
const TimeSpent = require('../models/TimeSpent')
const User = require("../models/User");



exports.timeSpent = async (req,res)=>{
    const {hours,minutes} = req.body

    const {projectId,taskId} = req.params
    const task = await Task.findById(taskId)
    let time_minutes = Number(minutes) + Number(hours*60)


    const user = req.session.user
    try{if (time_minutes > 0) { // Check if time spent is greater than 0
        const logTime = new TimeSpent({
            project: projectId,
            task: task._id,
            user: user._id,
            time_minutes
        });
        await logTime.save();

        await Task.updateOne(
            { _id: task._id },
            { $inc: { time_spent: time_minutes } }
        );

        res.redirect(`/project/getEachProject/${task.project_id}`);
    } else {
        // Handle case where time input is 0
        res.redirect(`/project/getEachProject/${task.project_id}`);
    }
    }catch (err){
        console.log(err)
        res.send('error')
    }
}

//for this user and this project
exports.totalTimeOnProject = async ( req, res) => {
    const {isManaging, projectId} = req.params
    const userId = req.session.user._id
    try{
        let logs
        if(isManaging === '1')
             logs = await TimeSpent.find({project: projectId}).select('time_minutes').exec()
        else
             logs = await TimeSpent.find({project: projectId, user: userId}).select('time_minutes').exec()

        let sum = 0
        logs.forEach(el =>{
            sum+=el.time_minutes
        })
        const hours = Math.floor(sum/60)
        const minutes = sum%60
        res.json({hours,minutes})
    }catch (err){

    }
}

//for this user and this task
exports.totalTimeOnTask = async ( req, res) => {
    const {taskId, isManaging} = req.params
    const userId = req.session.user._id
    try{
        let logs
        if(isManaging === '1')
            logs = await TimeSpent.find({task: taskId}).select('time_minutes').exec()
        else
            logs = await TimeSpent.find({task: taskId, user: userId}).select('time_minutes').exec()

        let sum = 0
        logs.forEach(el =>{
            sum+=el.time_minutes
        })
        const hours = Math.floor(sum/60)
        const minutes = sum%60
        res.json({hours,minutes})
    }catch (err){

    }
}
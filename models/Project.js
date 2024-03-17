const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    project_name:{
        type:String, required: true
    },
    description:{
        type:String
    },
    start_date: {
        type: Date, default: Date.now
    },
    end_date: {
        type: Date
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"},
    tasks: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Task"}
    ],
    members: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User"}
    ],
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    completed: { type: Boolean, default: false}


})



module.exports = mongoose.model("Project", projectSchema)
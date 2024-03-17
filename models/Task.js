const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    start_date: {type: Date, default: Date.now},
    end_date: {type: Date},
    members: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    ],
    /*creator_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },*/
    project_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "Project",
    },

    time_spent: {type: Number},

    completed: { type: Boolean, default: false}
    // finish later. every time a user enters time spent on task, this will update


})

module.exports = mongoose.model("Task", taskSchema)
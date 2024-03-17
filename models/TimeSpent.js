const mongoose = require('mongoose')

const HoursSpentSchema = new mongoose.Schema({
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    task: {type: mongoose.Schema.Types.ObjectId, ref: "Task"},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    time_minutes: {type: Number}
})

module.exports = mongoose.model("HoursSpent", HoursSpentSchema)
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: true, maxLength: 12, minLength: 4
    },
    firstname: {
        type: String, required:true
    },
    lastname: {
        type: String, required:true
    },
    email: {
        type: String, required:true, unique:true
    },
    password: {
        type: String, required:true
    },
    position: {
        type: Number, default: 1
    },
    activity: {
        type: Boolean, default: false
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Project"
    }],
    managing_projects: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Project"
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Task"
    }],
    supervisors: [{
       type:  mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    subordinates: [{
        type:  mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    contacts: [{
        type:  mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref:"User" }
})

module.exports = mongoose.model("User", userSchema)
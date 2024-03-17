const express = require('express')
const router = express.Router()
const {isBoth, isThisManager} = require('../middleware/authentication')

const multer = require('multer');

const storage = multer.memoryStorage(); // Using in-memory storage, you can configure storage as needed
const upload = multer({ storage: storage });

const {
    createProject,
    deleteProject,
    getUserProjects,
    /*getManagingProjects,*/
    getEachProject,
    getBehindProjects,
    getCompletedProjects,
    UserProjectsJson, markProjectAsCompleted
} = require('../controllers/projectController')
const User = require("../models/User");

router.post('/createProject', upload.none(),isBoth ,createProject)
router.delete('/deleteProject/:projectId', isThisManager, deleteProject)

router.get('/getUserProjects', getUserProjects)
router.get('/UserProjectsJson/:isManaging/:report',UserProjectsJson)

//router.get('/getManagingProjects', getManagingProjects)

router.get('/getEachProject/:projectId', getEachProject)

router.get('/getBehindProjects/:isManaging', getBehindProjects)
router.get('/getCompletedProjects/:isManaging', getCompletedProjects)

router.post('/markProjectAsCompleted/:projectId', isThisManager,markProjectAsCompleted)





//router.post('/addProjectManager/:projectId', isThisManager ,addProjectManager)
//router.delete('/removeProjectManager/:projectId', isThisManager ,removeProjectManager)



module.exports = router
const express = require('express')
const router = express.Router()

const multer = require('multer');

const storage = multer.memoryStorage(); // Using in-memory storage, you can configure storage as needed
const upload = multer({ storage: storage });

const {isThisManager, isBoth} = require('../middleware/authentication')
const { createTask,
    deleteTask,
    addMember,
    removeMember,
    getUserTasks,
    getManagingTasks,
    getThisBehindTasks,
    getThisCompletedTasks,
    getThisAllTasks,
    getAllTasks,
    getBehindTasks,
    getCompletedTasks,
    getAllManagingTasks,
    markTaskAsCompleted
            } = require('../controllers/taskController')


router.post('/createTask/:projectId',  upload.none(),isThisManager, createTask)
router.delete('/deleteTask/:taskId', isThisManager, deleteTask)

router.post('/addMember/:taskId',upload.none(),isThisManager,addMember )
router.delete('/deleteMember/:taskId',isThisManager,removeMember )

//render
router.get('/getUserTasks', getUserTasks)
router.get('/getManagingTasks', getManagingTasks)


//filter tasks for specific project
router.get('/getThisAllTasks/:projectId/:report', getThisAllTasks)
router.get('/getThisBehindTasks/:projectId', getThisBehindTasks)
router.get('/getThisCompletedTasks/:projectId', getThisCompletedTasks)

//filter all tasks of user
router.get('/getAllTasks/:report', getAllTasks)
router.get('/getAllManagingTasks/:report', getAllManagingTasks)
router.get('/getBehindTasks/:isManaging', getBehindTasks)
router.get('/getCompletedTasks/:isManaging', getCompletedTasks)

router.post('/markTaskAsCompleted/:taskId',markTaskAsCompleted)




module.exports = router
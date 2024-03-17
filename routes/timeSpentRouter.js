const express = require('express')
const router = express.Router()
const {logTimeAuth} = require('../middleware/authentication')
const {timeSpent,totalTimeOnProject, totalTimeOnTask,totalTimeOnProject2} = require('../controllers/timeSpentController')


router.post('/:projectId/:taskId', logTimeAuth, timeSpent)

router.get('/totalTimeOnProject/:isManaging/:projectId', totalTimeOnProject)


router.get('/totalTimeOnTask/:isManaging/:taskId', totalTimeOnTask)


module.exports  = router
const express = require('express')
const router = express.Router()
const {getSupervisorPan} = require('../controllers/supervisorController')
const {isBoth} = require('../middleware/authentication')

router.get('/getSupervisorPan',isBoth, getSupervisorPan)


module.exports = router
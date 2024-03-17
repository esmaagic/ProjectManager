const {createUser,deleteUser,getAccount,getAllUsers, changePassword, getUserActivity} = require('../controllers/userController')
const express = require('express')
const router = express.Router()

const multer = require('multer');

const storage = multer.memoryStorage(); // Using in-memory storage, you can configure storage as needed
const upload = multer({ storage: storage });

const {isAdmin} = require('../middleware/authentication')

router.post('/createUser',upload.none(), isAdmin, createUser)

router.delete('/deleteUser/:username', deleteUser)

router.post('/changePassword', changePassword)

router.get('/getUserActivity', getUserActivity)

router.get('/account', getAccount)
router.get('/getAllUsers', getAllUsers)

module.exports = router
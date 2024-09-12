const express = require('express');
const { homePage, getAllUsers, createUser, getUserbyName, deleteUser, userLogin, userProfile, updateUser, logout } = require('../controller/controller');
const upload = require('../fileuploads/fileuploads');
const router = express.Router()




router.get('/', homePage)

router.get('/all', getAllUsers)

router.post('/create', upload.single('file'), createUser)

router.get('/user/:name', getUserbyName)

router.delete('/user/:name', deleteUser)

router.post('/login', userLogin)

router.get('/profile', userProfile)

router.patch('/user/:name', upload.single('file'), updateUser)

router.get('/logout', logout)

module.exports = router
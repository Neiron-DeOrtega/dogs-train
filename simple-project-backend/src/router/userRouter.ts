const express = require('express')
const userRouter = express()
const userController = require('../controller/userController')

userRouter.post('/login', userController.login)
userRouter.post('/register', userController.register)

module.exports = userRouter
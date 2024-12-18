import userController from "../controllers/userController"

// @ts-ignore
const express = require('express')
const userRouter = express.Router()

userRouter.post('/login', userController.login)
userRouter.post('/create', userController.create)
userRouter.put('/edit', userController.edit)
userRouter.delete('/delete', userController.delete)
userRouter.get('/stats/:uid', userController.getStats)
userRouter.get('/:uid', userController.getUserById)
userRouter.get('/', userController.getAllUsers)

module.exports = userRouter
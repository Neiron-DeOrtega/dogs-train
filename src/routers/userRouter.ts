import { adminVerify } from './../middleware/adminVerify';
import { tokenVerify } from './../middleware/tokenVerify';
import userController from "../controllers/userController"

// @ts-ignore
const express = require('express')
const userRouter = express.Router()

userRouter.post('/login', userController.login)
userRouter.post('/create', tokenVerify, adminVerify, userController.create)
userRouter.put('/edit', tokenVerify, adminVerify, userController.edit)
userRouter.delete('/delete', tokenVerify, adminVerify, userController.delete)
userRouter.get('/stats/:uid', tokenVerify, adminVerify, userController.getStats)
userRouter.get('/:uid', tokenVerify, adminVerify, userController.getUserById)
userRouter.get('/', tokenVerify, adminVerify, userController.getAllUsers)
userRouter.get('/protected', tokenVerify, userController.protected)
userRouter.get('/protected-admin', tokenVerify, adminVerify, userController.protectedAdmin)

module.exports = userRouter
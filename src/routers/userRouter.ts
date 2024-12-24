import { adminVerify } from './../middleware/adminVerify';
import { tokenVerify } from './../middleware/tokenVerify';
import userController from "../controllers/userController"

// @ts-ignore
const express = require('express')
const userRouter = express.Router()

userRouter.post('/login', userController.login) // Авторизация
userRouter.post('/create', tokenVerify, adminVerify, userController.create) // Создание пользователя
userRouter.put('/edit', tokenVerify, adminVerify, userController.edit) // Редактирование информации о пользователе
userRouter.delete('/delete', tokenVerify, adminVerify, userController.delete) // Удаление пользователя
userRouter.get('/stats/:uid', tokenVerify, adminVerify, userController.getStats) // Получение информации о пройденных опросах пользователя
userRouter.get('/:uid', tokenVerify, adminVerify, userController.getUserById) // Найти пользователя по ID
userRouter.get('/', tokenVerify, adminVerify, userController.getAllUsers) // Вывод всех пользователей
userRouter.get('/protected', tokenVerify, userController.protected) // Переход по защищенному роуту
userRouter.get('/protected-admin', tokenVerify, adminVerify, userController.protectedAdmin) // Переход на админ роут

module.exports = userRouter
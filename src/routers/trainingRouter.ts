import trainingController from "../controllers/trainingController"
import { adminVerify } from "../middleware/adminVerify"
import { tokenVerify } from "../middleware/tokenVerify"

// @ts-ignore
const express = require('express') 
const trainingRouter = express.Router()

trainingRouter.post('/submit', tokenVerify, trainingController.submit) // Сохрание пройденного опроса
trainingRouter.post('/create', tokenVerify, adminVerify, trainingController.create) // Создание неподтвержденного опроса
trainingRouter.get('/confirm/:sid', tokenVerify, adminVerify, trainingController.confirm) // Подтерждение и отправка опроса пользователям

module.exports = trainingRouter
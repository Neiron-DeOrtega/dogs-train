import trainingController from "../controllers/trainingController"
import { adminVerify } from "../middleware/adminVerify"
import { tokenVerify } from "../middleware/tokenVerify"

// @ts-ignore
const express = require('express') 
const trainingRouter = express.Router()

trainingRouter.post('/submit', tokenVerify, trainingController.submit) // Сохрание пройденного опроса
trainingRouter.post('/create', tokenVerify, adminVerify, trainingController.create) // Создание неподтвержденного опроса
trainingRouter.get('/confirm/:sid', tokenVerify, adminVerify, trainingController.confirm) // Подтерждение и отправка опроса пользователям
trainingRouter.get('/load', tokenVerify, trainingController.loadSurvey) // Загрузка непройденного опроса
trainingRouter.get('/unconfirmed', tokenVerify, adminVerify, trainingController.loadUnconfirmedSurveys) // Загрузка неподтвержденных опросов
trainingRouter.get('/delete/:sid', tokenVerify, adminVerify, trainingController.delete)

module.exports = trainingRouter
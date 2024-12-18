// @ts-ignore
const express = require('express') 
const trainingRouter = express.Router()

trainingRouter.post('/send', userController.login)
trainingRouter.post('/create', userController.create)
trainingRouter.put('/confirm', userController.edit)

module.exports = trainingRouter
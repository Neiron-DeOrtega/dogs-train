import trainingController from "../controllers/trainingController"

// @ts-ignore
const express = require('express') 
const trainingRouter = express.Router()

trainingRouter.post('/send', trainingController.send)
trainingRouter.post('/create', trainingController.create)
trainingRouter.put('/confirm', trainingController.confirm)

module.exports = trainingRouter
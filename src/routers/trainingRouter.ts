import trainingController from "../controllers/trainingController"
import { adminVerify } from "../middleware/adminVerify"
import { tokenVerify } from "../middleware/tokenVerify"

// @ts-ignore
const express = require('express') 
const trainingRouter = express.Router()

trainingRouter.post('/submit', tokenVerify, trainingController.submit)
trainingRouter.post('/create', tokenVerify, adminVerify, trainingController.create)
trainingRouter.get('/confirm/:sid', tokenVerify, adminVerify, trainingController.confirm)

module.exports = trainingRouter
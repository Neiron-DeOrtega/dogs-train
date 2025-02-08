import { AppDataSource } from "./data-source"
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const port = parseInt(process.env.PORT) || 3000
const userRouter = require('./routers/userRouter')
const trainingRouter = require('./routers/trainingRouter')
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use('/user', userRouter)
app.use('/training', trainingRouter)

AppDataSource.initialize().then(async () => {

    console.log("database connected")

}).catch(error => console.log(error))

app.listen(port, () => {
    console.log(`dogs-train listening on port ${port}`)
  })

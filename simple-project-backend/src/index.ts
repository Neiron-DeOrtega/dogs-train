import { AppDataSource } from "./data-source"
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = parseInt(process.env.PORT) || 5000
const postRouter = require('../src/router/postRouter')
const userRouter = require('../src/router/userRouter')

app.use(cors())
app.use(express.json())

app.use('/', postRouter)
app.use('/', userRouter)

AppDataSource.initialize().then(async () => {
    console.log('database connected')
}).catch(error => console.log(error))

app.listen(port, () => {
    console.log(`Приложение запущено на порту ${port}`)
})

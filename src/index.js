require('dotenv').config({silent:true});
var serverless = require('serverless-http')
const express = require('express')
const port = process.env.PORT
require('./db/mongoose')

const Task = require('./models/task')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const User = require('./models/user')

const app = express()



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


module.exports.handler = serverless(app);








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



app.listen(port, ()=>{
    console.log('server is up on port', port)
})








const mongoose = require('mongoose')


//connecting to DB using mongoose

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex:true
})



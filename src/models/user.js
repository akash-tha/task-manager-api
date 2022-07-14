const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {         
                if (value.includes("password")){
                    throw new Error('password value should not contain string password')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
             }
            }],
        avatar: {
            type: Buffer
        }

    })

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})

userSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token})
    await user.save()
    
    return token
}

userSchema.methods.toJSON =  function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredential = async (email,password)=> {
    const user = await User.findOne({email: email})

    if (!user) {
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('unable to login')
    }

    return user

}

//hashing the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){    
        user.password = await bcrypt.hash(user.password, 8)
    }
     next()
} )

//removing user's tasks when user deletes the account
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
     next()
} )

//Defining data model
const User = mongoose.model('User', userSchema)



module.exports= User
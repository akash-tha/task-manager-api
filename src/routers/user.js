const express = require('express')
const { update } = require('../models/user')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')




const router = express.Router()


//route to create a user with async await
router.post('/users', async (req,res)=>{
    
    const user = new User (req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.name, user.email)

        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})



//route to read users
router.get('/users/me',auth, async (req,res)=>{
    res.status(200).send(req.user)
    
})


//route to login user
router.post('/users/login',async (req,res)=>{
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }   

})

//route to logout user
router.post('/users/logout',auth, async (req,res)=>{
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }   

})

//route to logout user all sessions
router.post('/users/logoutAll',auth, async (req,res)=>{
    try {

        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }   

})



//route to update one user 
router.patch('/users/me',auth, async (req, res) => {    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','password']

    const isValidOpearion = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOpearion) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)    

    } catch(e) {
        res.status(400).send(e)
    }
})

//route to delete a user
router.delete('/users/me',auth, async (req,res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        
        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendCancelationEmail(req.user.name, req.user.email)

        
        res.send(req.user)

    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }   

})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx|jpg)$/)) {
            cb (new Error ('Please upload a word file'))
        }
        cb(undefined, true)
    }
   })

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res)=> {

    //req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    console.log(req)
    await req.user.save()
    
    res.send()
},(error, req, res, next)=> {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar',auth, async (req,res)=> {
    req.user.avatar = undefined
    await req.user.save()
    
    res.send()
})

router.get('/users/:id/avatar', async(req, res)=> {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    } catch(e){

    }
})



module.exports = router 
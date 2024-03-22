const User = require('../models/users-model')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const {pick} = require('lodash')
const usersCltr = {}

usersCltr.register = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        //sanitizing input data using loadash
        const body = pick(req.body,['username','email','password','role'])
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(user.password,salt)
        user.password=encryptedPassword
        await user.save()
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }

}

usersCltr.login = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = pick(req.body,['email','password'])
        const user = await User.findOne({email:body.email})
        if(!user){
            return res.status(404).json({errors:'Invalid email/password'})
        }
        const checkpassword = await bcryptjs.compare(body.password,user.password)
        if(!checkpassword){
            return res.status(404).json({errors:'Invalid email/password'})
        }
        const tokenData= {
            id:user._id,
            role:user.role,
            email:user.email
        }
        const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'14d'})
        res.json({'token':token})
    }catch(err){
        console.log(err)
        res.status(500).json({errors:'Internal Server Error'})
    }
}

module.exports = usersCltr
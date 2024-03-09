const User = require('../models/user-model')

const getData = async(req,res,next)=>{
    const id = req.user.id
    try{
        const user = await User.findOne({_id:id})
        if(!user){
            return res.status(400).json({error:'User dosent exist'})
        }
        const {body} = req
        body.name=user.username
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports = getData


const Payment = require('../models/payment-model')
const { validationResult } = require('express-validator')
const paymentsCltr={}

paymentsCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const roomid = req.params.roomid
        const buildingid = req.params.buildingid
        const {body} = req
        body.userId = req.user.id
        body.roomId = roomid
        body.buildingId = buildingid
        const payment = new Payment(body)
        await payment.save()
        res.json(payment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

paymentsCltr.list = async(req,res)=>{
    try{
        const buildingid = req.params.buildingid
        const payment = await Payment.find({buildingId:buildingid})
        res.json(payment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}


paymentsCltr.listone = async(req,res)=>{
    try{
        const buildingid = req.params.buildingid
        const id = req.params.paymentid
        const payment = await Payment.findOne({_id:id,buildingId:buildingid})
        res.json(payment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports = paymentsCltr
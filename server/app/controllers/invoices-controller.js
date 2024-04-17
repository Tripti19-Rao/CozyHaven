const Invoice = require('../models/invoices-model')
const {validationResult} = require('express-validator')
const {pick} = require('lodash')
const Room = require('../models/rooms-model')
const Building = require('../models/buildings-model')
const Payment = require('../models/payments-model')
const InvoicesCltr = {}

InvoicesCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = pick(req.body,['buildingId','roomId'])
        const room = await Room.findOne({_id:body.roomId, buildingId:body.buildingId})
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const building = await Building.findOne({_id:body.buildingId,})
        const price = room.amount + building.deposit
        const invoice1 = new Invoice(body)
        invoice1.amount = price
        invoice1.userId = req.user._id
        await invoice1.save()
        res.json(invoice1)
        
        // const body = pick(req.body,['amount'])
        // const invoice = new Invoice()
        // invoice.buildingId = req.params.buildingid
        // invoice.roomId=req.params.roomid
        // invoice.userId=req.user.id
        // invoice.amount = body.amount
        // await invoice.save()
        // const invoiceId = invoice._id
        // const amount = invoice.amount
        // res.json({invoiceId,amount})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

InvoicesCltr.list = async(req,res)=>{
    try{
        const id = req.params.id
    const invoice = await Invoice.findOne({_id:id})
    if(!invoice){
        return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice)
    }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
    }
}

InvoicesCltr.destroy = async(req,res)=>{
    try{
        const id = req.params.id
    const invoice = await Invoice.findOneAndDelete({_id:id})
    if(!invoice){
        return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice)
    }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
    }
}



module.exports = InvoicesCltr
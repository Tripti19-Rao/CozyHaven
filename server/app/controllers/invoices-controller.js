const Invoice = require('../models/invoices-model')
const {validationResult} = require('express-validator')
const {pick} = require('lodash')
const InvoicesCltr = {}

InvoicesCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = pick(req.body,['amount'])
        const invoice = new Invoice()
        invoice.buildingId = req.params.buildingid
        invoice.roomId=req.params.roomid
        invoice.userId=req.user.id
        invoice.amount = body.amount
        await invoice.save()
        const invoiceId = invoice._id
        const amount = invoice.amount
        res.json({invoiceId,amount})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}



module.exports = InvoicesCltr
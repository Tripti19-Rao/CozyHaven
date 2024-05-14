const Invoice = require('../models/invoices-model')
const { validationResult } = require('express-validator')
const { pick } = require('lodash')
const Room = require('../models/rooms-model')
const Building = require('../models/buildings-model')
const Guest = require('../models/guests-model')
const InvoicesCltr = {}

InvoicesCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = pick(req.body,['buildingId','roomId'])
        const room = await Room.findOne({_id:body.roomId, buildingId:body.buildingId})
        if(!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const building = await Building.findOne({_id:body.buildingId,})
        if(!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        const price = room.amount + building.deposit
        const invoice1 = new Invoice(body)
        invoice1.amount = price
        invoice1.userId = req.user.id //finders id
        await invoice1.save()
        //pushing invoice into guest
        const guest = await Guest.findOne({finderId: invoice1.userId,buildingId: invoice1.buildingId})
        if(guest) {
            guest.invoiceHistory = [...guest.invoiceHistory, invoice1._id]
            await guest.save()
        }
        res.json(invoice1)
    } catch(err){
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
    } catch(err){
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
    //removing invoice from guest 
    const guest = await Guest.findOne({finderId: invoice.userId,buildingId: invoice.buildingId})
    if(guest) {
        const filteredInvoice = guest.invoiceHistory.filter(ele => !(ele).equals(invoice._id))
        guest.invoiceHistory = filteredInvoice
        await guest.save()
    }
    res.json(invoice)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = InvoicesCltr
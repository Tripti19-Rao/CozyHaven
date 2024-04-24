const Payment = require('../models/payments-model')
const { validationResult } = require('express-validator')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const {pick} = require('lodash')
const Guest = require('../models/guests-model')
const Invoice = require('../models/invoices-model')
const Finder = require('../models/finder-model')
const Room = require('../models/rooms-model')
const paymentsCltr={}

paymentsCltr.pay = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = pick(req.body,['amount','invoiceId'])
    try{
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        })
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:"Booking-fee"
                    },
                    unit_amount:body.amount * 100
                },
                quantity: 1
            }],
            mode:"payment",
            success_url:"http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/cancel',
            customer : customer.id
        })
        
        // console.log(session.url)
        // console.log(session.id)

        const payment = new Payment(body)
        payment.invoiceId = body.invoiceId
        payment.transactionId = session.id
        payment.userId= req.user.id
        payment.paymentType = "card"
        payment.amount = Number(body.amount)
        await payment.save()

        //push the payment to paymentHistory of finders profile
        const finder = await Finder.findOne({userId: payment.userId})
        if(finder) {
            finder.paymentHistory = [...finder.paymentHistory, payment._id]
            await finder.save()
            //console.log('finder', finder)
        }

        //get the building id from invoice id
        const invoice = await Invoice.findOne({_id: payment.invoiceId})
        if(invoice) {
        //creating guest with basic details
        const guest = await Guest.findOne({userId: payment.userId,buildingId: invoice.buildingId})
        if(!guest) {
            const guest = new Guest()
            guest.finderId = finder._id
            guest.userId = req.user.id
            guest.buildingId = invoice.buildingId
            guest.roomId = invoice.roomId
            guest.email = req.user.email
            guest.invoiceHistory = [...guest.invoiceHistory, payment.invoiceId]
            guest.paymentHistory = [...guest.paymentHistory, payment._id]
            //guest.dateOfJoin = invoice.createdAt
            await guest.save()
            const room = await Room.findOneAndUpdate({_id: invoice.roomId},{$push:{ guest: guest._id}},{new:true})
            console.log(room)
        } else {
            //if the guset is already present then update the paymentHistory
            //guest.invoiceHistory = [...guest.invoiceHistory, payment.invoiceId]
            guest.paymentHistory = [...guest.paymentHistory, payment._id]
            console.log(guest)
            await guest.save()
        }
       
        }
        
        res.json({id:session.id,url:session.url,paymentId:payment._id,invoiceId:payment.invoiceId, buildingId: invoice.buildingId})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.list = async(req,res)=>{
    try{
        const buildingid = req.params.buildingid
        const payment = await Payment.find({buildingId:buildingid})
        res.json(payment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.listOne = async(req,res)=>{
    try{
        const buildingid = req.params.buildingid
        const id = req.params.paymentid
        const payment = await Payment.findOne({_id:id,buildingId:buildingid})
        if(!payment){
            return res.status(404).json({error:'Record Not Found'})
        }
        res.json(payment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.update = async(req,res) =>{
    try{
        const stripId = req.params.stripId
    const body = pick(req.body,['status'])
    const payment = await Payment.findOneAndUpdate({transactionId:stripId},body,{new:true})
    res.json(payment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})        
    }
}

module.exports = paymentsCltr
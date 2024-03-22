const Payment = require('../models/payments-model')
const { validationResult } = require('express-validator')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const {pick} = require('lodash')
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
        
        console.log(session.url)

        const payment = new Payment(body)
        payment.transactionId = session.id
        payment.userId= req.user.id
        payment.paymentType = "card"
        payment.amount = Number(body.amount)
        await payment.save()
        res.json({url: session.url})
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

module.exports = paymentsCltr
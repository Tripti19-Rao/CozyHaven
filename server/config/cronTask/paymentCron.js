const cron = require('node-cron')
const nodemailer = require('nodemailer')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Room = require('../../app/models/rooms-model')
const Invoice = require('../../app/models/invoices-model')
const Finder = require('../../app/models/finder-model')
const Payment = require('../../app/models/payments-model')
const Guest = require('../../app/models/guests-model')
const jwt = require('jsonwebtoken')
const cronPaymentJob = {}

    //use this in post man to see agregated data
    //http://localhost:3055/api/pay

 cronPaymentJob.pay = async (req,res)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SECRET_EMAIL,
            pass: process.env.SECRET_PASSWORD,
        },
    });
    
    
    //cron.schedule('*/10 * * * * *', async() => { 
        try{
           

            const data = await Room.find({guest: { $ne: [] }})
                .select('roomNo amount guest')
                .populate({
                    path: 'guest',
                    select: '_id name userId buildingId roomId paymentHistory',
                    populate: [
                        {
                            path: 'paymentHistory',
                            select: '_id amount createdAt'
                        }
                    ]
                })
            //the data here.. is a populated version of room that does not have any guests
            //next thing will be to extract email rent amount and id based on their payment history
            const today = new Date();
            const todayDate = today.getDate(); // Get today's date (day of the month)
            const invoiceObjects = [];

            data.forEach((ele) => {
                ele.guest.forEach((guest)=>{
                    const createdDate = new Date(guest.paymentHistory[guest.paymentHistory.length - 1].createdAt).getDate()
                    if(createdDate === todayDate){
                        console.log("Generate Invoice today", guest._id);
                        const invoiceObject = {
                            userId:guest.userId,
                            buildingId:guest.buildingId,
                            roomId:guest.roomId,
                            amount:ele.amount
                        }
                        invoiceObjects.push(invoiceObject);
                    //return true;
                    }
                    else{
                        console.log("No Invoice today", guest.paymentHistory[guest.paymentHistory.length - 1]._id);
                    //return false; 
                    }
                })


            });
            console.log(invoiceObjects)
            try{
                const response = await Invoice.insertMany(invoiceObjects)
                console.log("resposne is ", response)
                for (const ele of response) {
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
                    const payment = new Payment()

                    const tokenData = {
                        paymentId: payment._id
                    }

                    const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'14d'})

                    const session = await stripe.checkout.sessions.create({
                        payment_method_types:["card"],
                        line_items:[{
                            price_data:{
                                currency:'inr',
                                product_data:{
                                    name:"Booking-fee"
                                },
                                unit_amount:ele.amount * 100
                            },
                            quantity: 1
                        }],
                        mode:"payment",
                        success_url:`http://localhost:3000/success?token=${token}`,
                        cancel_url: `http://localhost:3000/cancel?token=${token}`,
                        customer : customer.id
                    })
                    // const payment = new Payment()
                    payment.invoiceId = ele._id
                    payment.transactionId = session.id
                    payment.userId= ele.userId
                    payment.paymentType = "card"
                    payment.amount = Number(ele.amount)
                    await payment.save()
                    //console.log(session.url)

                    const finder = await Finder.findOne({userId: ele.userId})
                        if(finder) {
                            finder.paymentHistory = [...finder.paymentHistory, payment._id]
                            await finder.save()
                            //console.log('finder', finder)
                        }
                    
                        const guest = await Guest.findOne({userId: ele.userId,buildingId: ele.buildingId})
                            .populate({
                                path: 'buildingId',
                                select: 'name'
                            })
                        if(guest) {
                            guest.invoiceHistory = [...guest.invoiceHistory, ele._id]
                            guest.paymentHistory = [...guest.paymentHistory, payment._id]
                            await guest.save()
                        }
                        console.log(guest.email)

                        const sessionData = {
                            sessionUrl: session.url,
                        }
    
                        const sessionUrl = jwt.sign(sessionData,process.env.JWT_SECRET,{expiresIn:'14d'})
                        
                        const mailOptions = {
                            from: process.env.SECRET_EMAIL,
                            to: guest.email,
                            subject: 'Sending Email using Node.js',
                            html: `<p>Hello ${guest.name},</p>
                            <p>Click <a href="http://localhost:3000/payment-link?session=${sessionUrl}">here</a> to pay your rent for ${guest.buildingId.name}.</p>`,
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log('Error sending email:', error);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                }
            }catch(err){
                console.log(err)
            }
            res.json(data);

        }catch(err){
            res.status(500).json({error: 'Internal Server Error'})
        }
    }
        
        
       
    
 

 module.exports = cronPaymentJob














// require('dotenv').config()
// const cron = require('node-cron')
// const nodemailer = require('nodemailer')
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
// const Room = require('../../app/models/rooms-model')
// const Invoice = require('../../app/models/invoices-model')
// const Payment = require('../../app/models/payments-model')
// const Finder = require('../../app/models/finder-model')
// const Guest = require('../../app/models/guests-model')

// const cronPaymentJob = {}

//     //use this in post man to see agregated data
//     //http://localhost:3055/api/pay
//  cronPaymentJob.pay = async (req,res)=>{
//     //cron.schedule('*/10 * * * * *', async() => { 
//         try{
//             //ne - not empty
//             const data = await Room.find({guest: { $ne: [] }})
//                 .select('roomNo amount guest')
//                 .populate({
//                     path: 'guest',
//                     select: '_id userId buildingId roomId paymentHistory',
//                     populate: [
//                         {
//                             path: 'paymentHistory',
//                             select: '_id amount userId createdAt'
//                         }
//                     ]
//                 })
            
//             //getting all the payments
//             const today = new Date()
//             const todayDate = today.getDate() // Get today's date (day of the month)
            
//             const lastpayment = [] , invoiceData = []
//             data.forEach(ele => {
//                 ele.guest.forEach(guest => {
//                     lastpayment.push(guest.paymentHistory[guest.paymentHistory.length - 1])
//                     const createdDate = new Date(guest.paymentHistory[guest.paymentHistory.length - 1].createdAt).getDate()
//                     if(createdDate === todayDate){
//                         console.log("Generate Invoice today", guest.paymentHistory[guest.paymentHistory.length - 1]._id);
//                         //invoiceData.push(guest.paymentHistory[guest.paymentHistory.length - 1])
//                         invoiceData.push(guest)
//                     }
//                      else{
//                         console.log("No Invoice today", guest.paymentHistory[guest.paymentHistory.length - 1]._id); 
//                     }
//                 })
//             })
//             //console.log('last',lastpayment)
//             console.log('invoice',invoiceData)

//             //generating invoice
//             const invoicesBody = []
//             invoiceData.forEach(ele => {
//                 let body = {}
//                 body.userId = ele.userId
//                 body.buildingId = ele.buildingId
//                 body.roomId = ele.roomId
//                 body.amount = ele.paymentHistory[ele.paymentHistory.length - 1].amount
//                 //console.log('body',body)
//                 invoicesBody.push(body)
//             })
//             //console.log('body',invoicesBody)
//             const invoices = await Invoice.insertMany(invoicesBody)

//             //generating payments
//             console.log(invoices)
//             for(let i=0; i<invoices.length;i++) {
//                 const customer = await stripe.customers.create({
//                     name: "Testing",
//                     address: {
//                         line1: 'India',
//                         postal_code: '517501',
//                         city: 'Tirupati',
//                         state: 'AP',
//                         country: 'US',
//                     },
//                 })

//                 const payment = new Payment()
//                 console.log(payment._id,'paymid')

//                 const session = await stripe.checkout.sessions.create({
//                     payment_method_types:["card"],
//                     line_items:[{
//                         price_data:{
//                             currency:'inr',
//                             product_data:{
//                                 name:"Booking-fee"
//                             },
//                             unit_amount: invoices[i].amount * 100
//                         },
//                         quantity: 1
//                     }],
//                     mode:"payment",
//                     success_url:`http://localhost:3000/success?paymentId=${payment._id}`,
//                     cancel_url: 'http://localhost:3000/cancel',
//                     customer : customer.id
//                 })

                
//                 payment.invoiceId = invoices[i]._id
//                 payment.transactionId = session.id
//                 payment.userId = invoices[i].userId
//                 payment.paymentType = 'card'
//                 payment.amount = Number(invoices[i].amount)
//                 await payment.save()

//                 //push the payment to paymentHistory of finders profile
//                 const finder = await Finder.findOne({userId: payment.userId})
//                 if(finder) {
//                     finder.paymentHistory = [...finder.paymentHistory, payment._id]
//                     await finder.save()
//                     //console.log('finder', finder)
//                 }

//                 //creating guest with basic details
//                 const guest = await Guest.findOne({userId: payment.userId,buildingId: invoices[i].buildingId})
//                 if(guest) {
//                     guest.invoiceHistory = [...guest.invoiceHistory, invoices[i]._id]
//                     guest.paymentHistory = [...guest.paymentHistory, payment._id]
//                     await guest.save() 
//                 }
//                 console.log('em', guest.email,guest.name)

//                 const transporter = nodemailer.createTransport({
//                         service: 'gmail',
//                         auth: {
//                             user: process.env.SECRET_EMAIL,
//                             pass: process.env.SECRET_PASSWORD,
//                         },
//                     });
//                 const mailOptions = {
//                     from: process.env.SECRET_EMAIL,
//                     to: guest.email,
//                     subject: 'Sending Email using Node.js',
//                     text: `Hello ${guest.name}, here is your rent payment link: ${session.url}`,
//                 };
//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log('Error sending email:', error);
//                     } else {
//                         console.log('Email sent:', info.response);
//                     }
//                 });

//             } 

//             res.json(data);

            

//         }catch(err){
//             console.log(err)
//             res.status(500).json({error: 'Internal Server Error'})
//         }

//         // const transporter = nodemailer.createTransport({
//         //     service: 'gmail',
//         //     auth: {
//         //         user: process.env.SECRET_EMAIL,
//         //         pass: process.env.SECRET_PASSWORD,
//         //     },
//         // });
        
//         // const mailOptions = {
//         //     from: process.env.SECRET_EMAIL,
//         //     to: 'kepajim229@dxice.com',
//         //     subject: 'Sending Email using Node.js',
//         //     text: 'That was easy!',
//         // };
        
//         // transporter.sendMail(mailOptions, function (error, info) {
//         //     if (error) {
//         //         console.log('Error sending email:', error);
//         //     } else {
//         //         console.log('Email sent:', info.response);
//         //     }
//         // });
//         // console.log('Cron job running every sec'); 
//     //});
//  }

//  module.exports = cronPaymentJob



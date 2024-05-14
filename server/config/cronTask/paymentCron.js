const cron = require('node-cron')
const nodemailer = require('nodemailer')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Room = require('../../app/models/rooms-model')
const Invoice = require('../../app/models/invoices-model')
const Finder = require('../../app/models/finder-model')
const Payment = require('../../app/models/payments-model')
const Guest = require('../../app/models/guests-model')
const jwt = require('jsonwebtoken')

const cronPaymentJob = cron.schedule('0 0 * * *', async() => { 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SECRET_EMAIL,
            pass: process.env.SECRET_PASSWORD,
        },
    });
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
                    }
                    else{
                        console.log("No Invoice today", guest.paymentHistory[guest.paymentHistory.length - 1]._id);
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
                    payment.invoiceId = ele._id
                    payment.transactionId = session.id
                    payment.userId= ele.userId
                    payment.paymentType = "card"
                    payment.amount = Number(ele.amount)
                    await payment.save()

                    const finder = await Finder.findOne({userId: ele.userId})
                        if(finder) {
                            finder.paymentHistory = [...finder.paymentHistory, payment._id]
                            await finder.save()
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
            } catch(err){
                console.log(err)
            }
            res.json(data);
        } catch(err){
            res.status(500).json({error: 'Internal Server Error'})
        }
    })
        
 module.exports = cronPaymentJob
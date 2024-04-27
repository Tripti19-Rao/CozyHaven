const cron = require('node-cron')
const nodemailer = require('nodemailer')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Room = require('../../app/models/rooms-model')
const Invoice = require('../../app/models/invoices-model')
const Finder = require('../../app/models/finder-model')
const Payment = require('../../app/models/payments-model')
const Guest = require('../../app/models/guests-model')
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
                    select: '_id userId buildingId roomId amount paymentHistory',
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
                        console.log("Generate Invoice today", guest.paymentHistory[guest.paymentHistory.length - 1]._id);
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
                        success_url:`http://localhost:3000/success?id=${payment._id}`,
                        cancel_url: `http://localhost:3000/cancel?id=${payment._id}`,
                        customer : customer.id
                    })
                    // const payment = new Payment()
                    payment.invoiceId = ele._id
                    payment.transactionId = session.id
                    payment.userId= ele.userId
                    payment.paymentType = "card"
                    payment.amount = Number(ele.amount)
                    await payment.save()
                    console.log(session.url)

                    const finder = await Finder.findOne({userId: ele.userId})
                        if(finder) {
                            finder.paymentHistory = [...finder.paymentHistory, payment._id]
                            await finder.save()
                            //console.log('finder', finder)
                        }
                    
                        const guest = await Guest.findOne({userId: ele.userId,buildingId: ele.buildingId})
                        if(guest) {
                            guest.invoiceHistory = [...guest.invoiceHistory, ele._id]
                            guest.paymentHistory = [...guest.paymentHistory, payment._id]
                            await guest.save()
                        }
                        console.log(guest.email)
                        
                        const mailOptions = {
                            from: process.env.SECRET_EMAIL,
                            to: guest.email,
                            subject: 'Sending Email using Node.js',
                            text: `Hello ${guest.name}, here is your rent payment link: ${session.url}`,
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



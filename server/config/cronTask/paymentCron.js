const cron = require('node-cron')
const nodemailer = require('nodemailer')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Room = require('../../app/models/rooms-model')
const cronPaymentJob = {}

    //use this in post man to see agregated data
    //http://localhost:3055/api/pay

 cronPaymentJob.pay = async (req,res)=>{
    //cron.schedule('*/10 * * * * *', async() => { 
        try{
            const data = await Room.aggregate([
                {
                    $lookup: {
                        from: 'guests', // Assuming 'guests' is the collection name for guests
                        localField: 'guest', // Field in the 'rooms' collection
                        foreignField: '_id', // Field in the 'guests' collection
                        as: 'guest' // Array field to store the matched guest
                    }
                },
                {
                    $match: {
                        'guest': { $ne: [] }, // Exclude rooms with empty 'guests' array
                        'guest.stay': true // Additional match condition for guests who are staying
                    }
                },
                {
                    $lookup: {
                        from: 'payments', // Assuming 'paymentHistory' is the collection name for payments
                        localField: 'guest.paymentHistory', // Field in the 'guests' array
                        foreignField: '_id', // Field in the 'payments' collection
                        as: 'guest.paymentHistory' // Array field to store the populated payment histories
                    }
                }
            ]);
            //the data here.. is a populated version of room that does not have any guests
            //next thing will be to extract email rent amount and id based on their payment history
            const invoiceData = data.filter((ele)=>{
                const lastpayment = ele.guest.paymentHistory[ele.guest.paymentHistory.length - 1]
                const generateinvoice = lastpayment 
            })
            console.log(invoiceData)

            res.json(data);

            

        }catch(err){
            res.status(500).json({error: 'Internal Server Error'})
        }

        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.SECRET_EMAIL,
        //         pass: process.env.SECRET_PASSWORD,
        //     },
        // });
        
        // const mailOptions = {
        //     from: process.env.SECRET_EMAIL,
        //     to: 'kepajim229@dxice.com',
        //     subject: 'Sending Email using Node.js',
        //     text: 'That was easy!',
        // };
        
        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log('Error sending email:', error);
        //     } else {
        //         console.log('Email sent:', info.response);
        //     }
        // });
        // console.log('Cron job running every sec'); 
    //});
 }

 module.exports = cronPaymentJob



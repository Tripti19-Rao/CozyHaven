const cron = require('node-cron')
const nodemailer = require('nodemailer')


cron.schedule('*/5 * * * * *', () => { 
    console.log('Cron job running every sec');

    
});


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
const { Schema , model } = require('mongoose') 

const paymentsSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    transactionId:String, //Session onject id
    invoiceId:{
        type:Schema.Types.ObjectId,
        ref:"Invoice"
    },
    paymentType:String,
    amount:Number,
    type:String,
},{timestamps:true})

const Payment = model('Payment',paymentsSchema)

module.exports = Payment


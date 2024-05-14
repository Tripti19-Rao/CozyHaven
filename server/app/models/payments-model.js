const { Schema , model } = require('mongoose') 

const paymentsSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    transactionId:String, //Session object id
    invoiceId:{
        type:Schema.Types.ObjectId,
        ref:"Invoice"
    },
    paymentType:String,
    amount:Number,
    type:String,
    status:{
        type:String,
        default:'Pending'
    }
},{timestamps:true})

const Payment = model('Payment',paymentsSchema)

module.exports = Payment


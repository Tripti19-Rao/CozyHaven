const { Schema , model } = require('mongoose') 

const paymentsSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    roomId:{
        type:Schema.Types.ObjectId,
        ref:'Room'
    },
    buildingId:{
        type:Schema.Types.ObjectId,
        ref:'Building'
    },
    transactionId:String,
    payment:String,
    amount:Number,
    type:String,
},{timestamps:true})

const Payment = model('Payment',paymentsSchema)

module.exports = Payment
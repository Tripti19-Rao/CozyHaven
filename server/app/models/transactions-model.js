const { Schema, model } = require('mongoose')

const transactionsSchema = new Schema({
    paymentid:{
        type:Schema.Types.ObjectId,
        ref:'Payment'
    },
    userid:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    buildingId:{
        type:Schema.Types.ObjectId,
        ref:'Building'
    },
    roomId:{
        type:Schema.Types.ObjectId,
        ref:'Room'
    },
    amount:Number
},{timestamps:true})

const Transaction = model('Transaction', transactionsSchema)

module.exports = Transaction




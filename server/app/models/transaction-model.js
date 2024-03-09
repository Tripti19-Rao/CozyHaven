const { Schema, model } = require('mongoose')

const transactionSchema = new Schema({
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
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction




const { Schema , model } = require('mongoose')

const invoicesSchema = new Schema({
    userId:{
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
    amount:Number,
},{timestamps:true})

const Invoice = model('Invoice', invoicesSchema)

module.exports = Invoice




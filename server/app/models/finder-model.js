const {Schema, model} = require('mongoose')

const findersSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    wishList:[{
        type: Schema.Types.ObjectId,
        ref: 'Building'
      }], //an array of buildingId's
    paymentHistory : [{
        type: Schema.Types.ObjectId,
        ref: 'Payment'
      }] //an array of invoiceId's
},{timestamps: true})

const Finder = model('Finder',findersSchema)

module.exports = Finder
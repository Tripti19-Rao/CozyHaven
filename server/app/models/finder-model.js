const {Schema, model} = require('mongoose')

const findersSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    wishList: [Schema.Types.ObjectId], //an array of buildingId's
    paymentHistory : [Schema.Types.ObjectId] //an array of invoiceId's
},{timestamps: true})

const Finder = model('Finder',findersSchema)

module.exports = Finder
const {Schema, model} = require('mongoose')

const findersSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    wishList:[{
        type: Schema.Types.ObjectId,
        ref: 'Building'
      }],
    paymentHistory : [{
        type: Schema.Types.ObjectId,
        ref: 'Payment'
      }] 
},{timestamps: true})

const Finder = model('Finder',findersSchema)

module.exports = Finder
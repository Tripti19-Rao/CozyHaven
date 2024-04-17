const {Schema, model} = require('mongoose')

const guestsSchema = new Schema({
    finderId : Schema.Types.ObjectId,
    buildingId : {
        type: Schema.Types.ObjectId,
        ref: 'Building'
    },
    roomId:  {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    ownerId: {
        type: Schema.Types.ObjectId
    },
    name: String,
    gender: String,
    dob: Date,
    phoneNo: Number,
    email: String,
    address: String,
    aadharNo: Number,
    aadharPic: [{
        type: String
    }],
    qualification: String,
    guardian: String,
    guardianNo: Number,
    invoiceHistroy:[{
        type:Schema.Types.ObjectId,
        ref:'Invoice'
    }],
    paymentHistroy:[{
        type:Schema.Types.ObjectId,
        ref:'Payment'
    }],
    dateOfJoin : {
        type:Date
    },
    rentDate : {
        type:Date,
        default: function(){
            return this.dateOfJoin
        }
    },
    stay:{
        type:Boolean,
        default:true
    }
},{timestamps: true})

const Guest = model('Guest',guestsSchema)

module.exports = Guest
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
    userId: {
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
    invoiceHistory:[{
        type:Schema.Types.ObjectId,
        ref:'Invoice'
    }],
    paymentHistory:[{
        type:Schema.Types.ObjectId,
        ref:'Payment'
    }],
    // dateOfJoin : {
    //     type:Date
    // },
    // rentDate : {
    //     type:Date,
    //     default: function() {
    //         return this.dateOfJoin
    //     }
    // },
    stay:{
        type:Boolean,
        default:true
    },
    isComplete: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

const Guest = model('Guest',guestsSchema)

module.exports = Guest
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
    rent: Number
},{timestamps: true})

const Guest = model('Guest',guestsSchema)

module.exports = Guest
const {Schema, model} = require('mongoose')
const Building = require('../models/building-model')
const Room = require('../models/rooms-model')

const guestsSchema = new Schema({
    finderId : Schema.Types.ObjectId,
    buildingId : {
        type: Schema.Types.ObjectId,
        ref: Building
    },
    roomId:  {
        type: Schema.Types.ObjectId,
        ref: Room
    },
    ownerId: {
        type: Schema.Types.ObjectId
    },
    name: String,
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
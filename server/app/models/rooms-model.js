const {Schema, model} = require('mongoose')
const Building = require('./building-model')

const roomsSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: Building
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: Building 
    },
    roomNo: String,
    sharing: Number,
    amount: Number,
    pic: [{
        type: String
    }],
    guest: [Schema.Types.ObjectId]
},{timestamps: true})

const Room = model('Room',roomsSchema)

module.exports = Room
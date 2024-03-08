const {Schema, model} = require('mongoose')
const Building = require('./building-model')

const roomsSchema = new Schema({
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: Building 
    },
    roomNo: String,
    sharing: Number,
    amount: Number,
    pic: String,
    guest: [Schema.Types.ObjectId]
},{timestamps: true})

const Room = model('Room',roomsSchema)

module.exports = Room
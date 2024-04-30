const { Schema , model } = require('mongoose')

const buildingsSchema = new Schema({
    ownerId:{
        type:Schema.Types.ObjectId,
        ref:'User'
        },
    rooms:[{
        roomid:{
            type:Schema.Types.ObjectId,
            ref:'Room'
        }
    }],
        
    profilePic:String,
    name:String,
    gender: String,
    address:String,
    contact:String,
    deposit:Number,
    amenities: [{
        type: Schema.Types.ObjectId,
        ref: 'Amenity'
      }],
    amenitiesPic:[{
        type: String,
      }],              
    rules:String,          
    license:String,  
    geolocation:{
        lat:String,
        lng:String
    },
    rating:{
        type:Number,
        default:0
    },
    isApproved:{
        type:String,
        default:'Pending'
    }
},{timestamps:true})

const Building = model('Building', buildingsSchema)

module.exports = Building


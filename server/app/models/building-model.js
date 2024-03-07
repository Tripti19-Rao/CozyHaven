const { Schema , model } = require('mongoose')

const buildingSchema = new Schema({
    ownerId:{
        type:Schema.Types.ObjectId,
        ref:'User'
        },
    profilePic:String,//file upload using multer
    name:String,
    address:String,
    contact:String,
    deposit:Number,
    amenitiesPic:[{
        type: String,
      }],               //stores more thn one file
    rules:String,          //rich text editor
    license:[{
        type: String,   //stores more thn one file
      }],  
    geolocation:{
        lat:String,
        lng:String
    },
    isApproved:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Building = model('Building', buildingSchema)

module.exports = Building
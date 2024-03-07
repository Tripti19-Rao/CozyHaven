const {Schema, model} = require('mongoose')

const userSchema= new Schema({
    username:String,
    email:String,
    role:String,
    password:String
},{timestamps:true})

const User = model('User',userSchema)

module.exports = User
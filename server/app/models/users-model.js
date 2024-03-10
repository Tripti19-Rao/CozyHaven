const {Schema, model} = require('mongoose')

const usersSchema= new Schema({
    username:String,
    email:String,
    role:String,
    password:String
},{timestamps:true})

const User = model('User',usersSchema)

module.exports = User
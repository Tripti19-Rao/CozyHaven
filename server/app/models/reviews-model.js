const { Schema , model } = require('mongoose')

const reviewsSchema = new Schema({
    userId:String,
    finderId:String,
    buildingId:String,
    name:String,
    profile:String,
    stars:String,
    description:String
},{timestamps:true})

const Review = model('Review', reviewsSchema)

module.exports = Review
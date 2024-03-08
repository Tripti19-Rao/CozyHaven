const { Schema , model } = require('mongoose')

const reviewsSchema = new Schema({
userId:String,
buildingId:String,
name:String,
stars:String,
description:String
},{timestamps:true})

const Review = model('Review', reviewsSchema)

module.exports = Review
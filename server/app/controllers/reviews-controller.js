const { validationResult } = require('express-validator')
const { pick } = require('lodash')
const Review = require('../models/reviews-model')
const Guest = require('../models/guests-model')
const Building = require('../models/buildings-model')
const reviewsCltr = {}

reviewsCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const userId = req.user.id
        const buildingId = req.params.buildingid
        const guest = await Guest.findOne({userId:userId, buildingId:buildingId})

        if(!guest){
            return res.status(404).json({error:"User must first be a tenat in this PG in order to give a review"})
        }
        const body = pick(req.body,['name','stars','description','finderId'])
        const review = new Review(body)
        review.userId = req.user.id
        review.buildingId = buildingId

        if(!body.name || body.name.trim()===""){
            review.name = guest.name
            review.profile = guest.profile
        }
        else{
            review.profile="https://res.cloudinary.com/dhyi1lo45/image/upload/v1714388849/GuestProfile/logo_ktysdl.png"
        }
        await review.save()
        const building = await Building.findOne({_id:buildingId})

        if(building.rating===0){
            building.rating = Number(body.stars)
        }else{
            const newRating = (Number(building.rating) + Number(body.stars)) / 2
            const roundedNewRating =  (Math.floor(newRating * 10) / 10).toFixed(1);
            building.rating = roundedNewRating
        }
        await building.save()
        res.json(review)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

reviewsCltr.list = async(req,res)=>{
    try{
        const buildingid = req.params.buildingid
        const reviews = await Review.find({buildingId:buildingid})
        if(!reviews){
            return res.status(404).json({message: 'Record Not Found'})
        }
        res.json(reviews)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

reviewsCltr.update = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const buildingid = req.params.buildingid
        const body = pick(req.body,['stars','description'])
        const review = await Review.findOneAndUpdate({userId:req.user.id,buildingId:buildingid},body,{new:true})
        res.json(review)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

reviewsCltr.destroy = async(req,res)=>{
    try{
        const reviewid = req.params.reviewid
        const buildingid = req.params.buildingid
        const userid = req.user.id
        const review = await Review.findByIdAndDelete({_id:reviewid,buildingId:buildingid,userId:userid})
        res.json(review)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = reviewsCltr
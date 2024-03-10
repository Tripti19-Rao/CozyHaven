const { validationResult } = require('express-validator')
const { pick } = require('lodash')
const Review = require('../models/reviews-model')
const reviewsCltr = {}

reviewsCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const buildingid = req.params.buildingid
        const body = pick(req.body,['name','stars','description'])
        const review = new Review(body)
        review.userId = req.user.id
        review.buildingId = buildingid
        await review.save()
        res.json(review)
    }catch(err){
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
    }catch(err){
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
    }catch(err){
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
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = reviewsCltr
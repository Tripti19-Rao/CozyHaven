const { validationResult } = require('express-validator')
const { pick } = require('lodash')
const Review = require('../models/review-model')
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
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports = reviewsCltr
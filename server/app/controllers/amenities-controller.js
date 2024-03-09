const Amenity = require('../models/amenities-model')
const {validationResult} = require('express-validator')
const amenitiesCltr = {}

amenitiesCltr.create = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {body} = req
    try {
        const amenity = new Amenity(body)
        const a2 = await Amenity.findOne({name: amenity.name})
        if(a2) {
            return res.status(400).json({error: 'Amenity already exists'})
        }
        await amenity.save()
        res.json(amenity)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

amenitiesCltr.list = async (req,res) => {
    try {
        const amenities = await Amenity.find()
        res.json(amenities) 
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

amenitiesCltr.update = async (req,res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const id = req.params.id
        const {body} = req
        const amenity = await Amenity.findOneAndUpdate({_id: id},body,{new: true})
        res.json(amenity)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

amenitiesCltr.destroy = async (req,res) => {
    try {
        const id = req.params.id
        const amenity = await Amenity.findOneAndDelete({_id: id})
        res.json(amenity)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = amenitiesCltr

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
        res.json(amenity)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = amenitiesCltr

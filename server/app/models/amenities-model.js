const {Schema, model} = require('mongoose')

const amenitiesSchema = new Schema({
    name: String,
    iconName : String
},{timestamps: true})

const Amenity =  model('Amenity',amenitiesSchema)

module.exports = Amenity
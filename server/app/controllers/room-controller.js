const Room = require('../models/rooms-model')
const Building = require('../models/building-model')
const {pick} = require('lodash')
const {validationResult} = require('express-validator')

const roomsCtrl = {}
/*ROOMS:
_id:
building_id:_id(building)
roomno:
sharing:3
amount:
pic:
guests:[] */
roomsCltr.create = async(req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array()})
    }
    const buildingId = req.params.id
    const body = pick(req.body,['roomNo','sharing','amount','guests'])
    console.log(body)
    const {file} = req
    try{
        const room = new Room({
            buildingId,
            roomNo,
            sharing,
            amount,
            pic: file.fieldName
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = roomsCtrl

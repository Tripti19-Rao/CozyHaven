const Room = require('../models/rooms-model')
const {pick} = require('lodash')
const {validationResult} = require('express-validator')
const roomsCltr = {}

roomsCltr.create = async(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const buildingId = req.params.buildingid
    const body = pick(req.body,['roomNo','sharing','amount'])
    try{
        const room = new Room(body)
        room.ownerId = req.user.id
        room.buildingId = buildingId
        room.pic = req.files['pic'] ? req.files['pic'].map(file => file.path) : [];
        await room.save()
        res.json(room)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

roomsCltr.list = async (req,res) => {
    try{
        const buildingId = req.params.buildingid
        const rooms = await Room.find({ownerId:req.user.id,buildingId: buildingId})
        if(!rooms) {
            return res.json({message: 'Record Not Found'})
        }
        res.json(rooms)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

roomsCltr.update = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const id = req.params.id
    const buildingId = req.params.buildingid
    const body = pick(req.body,['roomNo','sharing','amount'])
    const {files} = req
    body.pic = files['pic'] ? files['pic'].map(file => file.path) : [];
    try {
        const room = await Room.findOneAndUpdate({_id: id,ownerId:req.user.id,buildingId: buildingId},body,{new:true})
        if(!room) {
            return res.json({message: 'Record Not Found'})
        }
        res.json(room)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

roomsCltr.destroy = async (req,res) => {
    const id = req.params.id
    const buildingId = req.params.buildingid
    try{
        const room = await Room.findOneAndDelete({_id: id,ownerId:req.user.id,buildingId: buildingId})
        if(!room) {
            return res.json({message: 'Record Not Found'})
        }
        res.json(room)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = roomsCltr

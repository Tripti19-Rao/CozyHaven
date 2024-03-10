const {validationResult} = require('express-validator')
const Guest = require('../models/guests-model')
const { pick } = require('lodash')
const guestsCltr = {}

guestsCltr.create = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const buildingId = req.params.buildingid
    const roomId = req.params.roomid
    const body = pick(req.body,['name','dob','phone','email','address','aadharNo','qualification','guardian','guardianNo','ownerId'])
    try{
        //checking if the guest already exists
        const guest1 = await Guest.findOne({finderId: req.user.id,buildingId: buildingId})
        if(guest1) {
            return res.status(400).json({error: 'Guest already exists'})
        }
        const guest2 = new Guest(body)
        guest2.finderId = req.user.id
        guest2.buildingId = buildingId
        guest2.roomId = roomId
        guest2.aadharPic = req.files['aadharPic'] ? req.files['aadharPic'].map(file => file.path) : []
        //saving guest
        await guest2.save()
        res.json(guest2)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

guestsCltr.list = async (req,res) => {
    try {
        const buildingId = req.params.buildingid
        const guests = await Guest.find({ownerId: req.user.id,buildingId: buildingId})
        if(!guests) {
            return res.json({message: 'Record Not Found'})
        }
        res.json(guests)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

guestsCltr.update = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const id = req.params.id
    const buildingId = req.params.buildingid
    const body = pick(req.body,['name','dob','phone','email','address','aadharNo','qualification','guardian','guardianNo','ownerId'])
    body.aadharPic = req.files['aadharPic'] ? req.files['aadharPic'].map(file => file.path) : []
    try {
        const guest = await Guest.findOneAndUpdate({_id: id,ownerId:req.user.id,buildingId: buildingId},body,{new:true})
        if(!guest) {
            return res.json({message: 'Record Not Found'})
        }
        res.json(guest)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

guestsCltr.destroy = async (req,res) => {
    const id = req.params.id
    const buildingId = req.params.buildingid
    try{
        const guest = await Guest.findOneAndDelete({_id: id,ownerId:req.user.id,buildingId: buildingId})
        if(!guest) {
            return res.json({message: 'Record Not Found'})
        }
        res.json(guest)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = guestsCltr
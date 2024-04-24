const Room = require('../models/rooms-model')
const Building = require('../models/buildings-model')
const {pick, isEmpty} = require('lodash')
const {validationResult} = require('express-validator')
const cloudinary = require('../middlewares/cloudinary')
const { pic } = require('../validators/rooms-validation')
const roomsCltr = {}

roomsCltr.create = async(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const buildingId = req.params.buildingid
    const body = pick(req.body,['roomNo','sharing','amount'])

    // if(isEmpty(req.files)) {
    //     return res.status(400).json({message: 'please upload the room images'})
    // }

    try{
        const multipleImagesUpload = async (files) => {
            const uploadedImages = []
            for(const file of files) {
                const result = await cloudinary.uploader.upload(file.path,{folder: 'CloudImages'})
                uploadedImages.push(result.secure_url)
            }
            return uploadedImages
        }

        const roompic = await multipleImagesUpload(req.files.pic)

        const room = new Room(body)
        room.ownerId = req.user.id
        room.buildingId = buildingId
        room.pic = roompic.map(ele => ele)
        await room.save()

        const building = await Building.findById({_id: room.buildingId})
        if(building) {
            building.rooms = [...building.rooms, {roomid: room._id}]
            await building.save()
        }

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
            return res.status(404).json({message: 'Record Not Found'})
        }
        res.json(rooms)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

roomsCltr.updateRoompics = async (req,res) => {
    try {
        console.log('pic')
        const multipleImagesUpload = async (files) => {
            const uploadedImages = []
            for(const file of files) {
                const result = await cloudinary.uploader.upload(file.path,{folder: 'RoomPics'})
                uploadedImages.push(result.secure_url)
            }
            return uploadedImages
        }
    
        const pic = await multipleImagesUpload(req.files.pic)
        console.log(pic)
        //pic = roompic.map(ele => ele)
        res.status(200).json(pic)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: err})
    }
}

roomsCltr.update = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const id = req.params.id
    const buildingId = req.params.buildingid
    const body = pick(req.body,['roomNo','sharing','amount','pic'])

    // const multipleImagesUpload = async (files) => {
    //     const uploadedImages = []
    //     for(const file of files) {
    //         const result = await cloudinary.uploader.upload(file.path,{folder: 'CloudImages'})
    //         uploadedImages.push(result.secure_url)
    //     }
    //     return uploadedImages
    // }

    // const roompic = await multipleImagesUpload(req.files.pic)
    // body.pic = roompic.map(ele => ele)
    
    try {
        const room = await Room.findOneAndUpdate({_id: id,ownerId:req.user.id,buildingId: buildingId},body,{new:true})
        if(!room) {
            return res.status(404).json({message: 'Record Not Found'})
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
    //console.log('id',id,'build',buildingId,'owner', req.user.id )
    try{
        const room = await Room.findOneAndDelete({_id: id,ownerId:req.user.id,buildingId: buildingId})
        if(!room) {
            return res.status(404).json({message: 'Record Not Found'})
        }

        //delete from building also
        const building = await Building.findById({_id: room.buildingId})
        if(building) {
        const roomObjectId =  (room._id); // Convert room._id to ObjectId
        const filteredRooms = building.rooms.filter(ele => !(ele.roomid).equals(roomObjectId));
            //console.log(filteredRooms);
            building.rooms = filteredRooms
            await building.save()
        }

        res.status(201).json(room)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = roomsCltr

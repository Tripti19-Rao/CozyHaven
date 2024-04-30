const { pick } = require('lodash')
const Finder = require('../models/finder-model')
const { populate } = require('../models/guests-model')
const Guest = require('../models/guests-model')
const findersCltr = {}

findersCltr.create = async (req,res) => {
    try {
        const userid = req.user.id //when the user Logs in finder-Profile will be created using the userId from token
        const finder1 = await Finder.findOne({userId: userid})
        if(finder1) {
           return res.json(finder1)
        } else {
            const {body} = req
            body.userId = userid
            const finder2 = new Finder(body)
            await finder2.save()
           return res.json(finder2)
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

findersCltr.list = async (req,res) => {
    try {
        const userid = req.user.id
        const finder = await Finder.find({userId: userid})
        res.json(finder)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

findersCltr.listOne = async (req,res) => {
    try {
        const userid = req.user.id
        const finder = await Finder.findOne({userId: userid})
        if(!finder) {
            return res.status(404).json({message: 'Record Not Found'})
        }
        return res.status(201).json(finder)
        //console.log(finder)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}


findersCltr.listWishlist = async (req,res) => {
    try {
        const userid = req.user.id
        const finder = await Finder.findOne({userId: userid}).populate({
            path: 'wishList',
            populate: [
                { path: 'amenities' }, // Populate amenities within wishList
                { path: 'rooms.roomid' } // Populate roomId within rooms within wishList
            ]
        }).populate({
            path: 'paymentHistory',
            populate: [
                {
                    path: 'invoiceId',
                    select: '_id buildingId roomId',
                    populate: [
                        {
                            path: 'buildingId',
                            select: '_id name'
                        },
                        {
                            path: 'roomId',
                            select: '_id roomNo'
                        }
                    ]
                }
            ]
        })

        
        if(!finder) {
            return res.status(404).json({message: 'Record Not Found'})
        }
        return res.status(201).json(finder)
        //console.log(finder)

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

findersCltr.update = async (req,res) => {
    //const id = req.params.id
    const userid = req.user.id
    const {body} = req
   
    try {
        const finder = await Finder.findOneAndUpdate({userId: userid},body,{new: true})
        if(!finder) {
            return res.status(404).json({message: 'Record Not Found'})
        }
        return res.json(finder)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

//get all the buildings the user stayed in 
findersCltr.mine = async (req,res) => {
    const finderid = req.params.id
    try {
        const myBuildings = await Guest.find({finderId: finderid}).populate({
            path: 'buildingId',
            select: '_id profilePic rooms name gender address contact amenities rating ',
            populate: [
                {
                    path: 'amenities',
                    select: '_id name iconName'
                },
                {
                    path: 'rooms.roomid',
                    select: '_id amount sharing guest'
                }
            ]

        }).sort({ _id: -1 })
        res.status(201).json(myBuildings)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}


module.exports = findersCltr
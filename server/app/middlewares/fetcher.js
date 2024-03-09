const User = require('../models/user-model')
const Building = require('../models/building-model')

const getUserName = async (req,res,next)=>{
    const id = req.user.id
    try{
        const user = await User.findOne({_id:id})
        if(!user){
            return res.status(400).json({error:'User dosent exist'})
        }
        const {body} = req
        body.name=user.username
        next()
    } catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

const getOwnerId = async (req,res,next) => {
    const buildingId = req.params.buildingid
    try {
        const building = await Building.findOne({_id: buildingId})
        if(!building) {
            return res.status(400).json({error: 'Building does not exist'})
        }
        const {body} = req
        body.ownerId = building.ownerId
        next()
    } catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}



module.exports = {
    getUserName,
    getOwnerId
}


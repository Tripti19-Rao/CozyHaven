const User = require('../models/users-model')
const Review = require('../models/reviews-model')
const Building = require('../models/buildings-model')

const getUserName = async (req,res,next)=>{
    const id = req.user.id
    const buildingid = req.params.buildingid
    try{
        //Checking if User has already posted a review
        const check = await Review.findOne({userId:id,buildingId:buildingid})
        if(check){
            return res.status(400).json({error:'You can only write one review'})
        }
        //Check if the User exists
        const user = await User.findOne({_id:id})
        if(!user){
            return res.status(400).json({error:'User doesnt exist'})
        }
        const {body} = req
        body.name=user.username
        next()
    } catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

const getOwnerId = async (req,res,next) => {
    const buildingId = req.params.buildingid
    try {
        //Checking if Building exists
        const building = await Building.findOne({_id: buildingId})
        if(!building) {
            return res.status(400).json({error: 'Building does not exist'})
        }
        const {body} = req
        body.ownerId = building.ownerId
        next()
    } catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = {
    getUserName,
    getOwnerId
}


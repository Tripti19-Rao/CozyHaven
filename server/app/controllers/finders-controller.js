const { pick } = require('lodash')
const Finder = require('../models/finder-model')
const findersCltr = {}

findersCltr.create = async (req,res) => {
    try {
        const userid = req.user.id //when the user Logs in finder-Profile will be created using the userId from token
        const finder1 = await Finder.findOne({userId: userid})
        if(finder1) {
            res.json(finder1)
        } else {
            const {body} = req
            body.userId = userid
            const finder2 = new Finder(body)
            await finder2.save()
            res.json(finder2)
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

findersCltr.update = async (req,res) => {
    const id = req.params.id
    const userid = req.user.id
    const {body} = req
    body.userId = userid
    try {
        const finder = await Finder.findOneAndUpdate({_id: id, userId: userid},body,{new: true})
        if(!finder) {
            res.status(404).json({message: 'Record Not Found'})
        }
        res.json(finder)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = findersCltr
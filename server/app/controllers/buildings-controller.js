const { validationResult } = require('express-validator')
const {pick} = require('lodash')
const Building = require('../models/buildings-model')
const buildingsCltr= {}

buildingsCltr.create = async(req,res)=>{
   const errors = validationResult(req)
   if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
   }
   try{
    const body = pick(req.body,['name','address','contact','deposit','rules','geolocation.lat','geolocation.lng','amenities','gender'])
    const building = new Building(body)
    building.ownerId = req.user.id
    building.profilePic = req.files['profilePic'] ? req.files['profilePic'][0].path : null;
    building.amenitiesPic = req.files['amenitiesPic'] ? req.files['amenitiesPic'].map(file => file.path) : [];
    building.license = req.files['license'] ? req.files['license'].map(file => file.path) : [];
    await building.save()
    res.status(200).json(building)
   }catch(err){
    console.log(err)
    res.status(500).json({error:'Internal Server Error'})
   }
}

buildingsCltr.list = async(req,res)=>{
   const id = req.user.id
   try{
      const buildings = await Building.find({ownerId:id})
      if(!buildings){
        return res.status(200).json('You dont own any building yet')
      }
      res.json(buildings)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }   
}

buildingsCltr.destroy = async(req,res)=>{
   const id = req.params.id
   try{
      const building = await Building.findOneAndDelete({_id:id,ownerId:req.user.id})
      if(!building){
         return res.status(404).json({error:'Building not found'})
      }
      res.json(building)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

buildingsCltr.update = async(req,res)=>{
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
   }
   const id = req.params.id
   const {body} = req
   body.profilePic = req.files['profilePic'] ? req.files['profilePic'][0].path : null;
   body.amenitiesPic = req.files['amenitiesPic'] ? req.files['amenitiesPic'].map(file => file.path) : [];
   body.license = req.files['license'] ? req.files['license'].map(file => file.path) : [];
   try{
      const building = await Building.findOneAndUpdate({_id:id},body,{new:true})
      res.json(building)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

module.exports = buildingsCltr
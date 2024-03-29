const { validationResult } = require('express-validator')
const {pick} = require('lodash')
const Building = require('../models/buildings-model')
const nodemailer = require('nodemailer');
const buildingsCltr= {}
const ObjectId = require('mongoose').Types.ObjectId;
const Amenity = require('../models/amenities-model')
const Room = require('../models/rooms-model');
const mongoose = require('mongoose');

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

buildingsCltr.listPendingApproval = async(req,res)=>{
   try{
      const buildings = await Building.find({isApproved:'Pending'})
      res.json(buildings)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }   
}

buildingsCltr.approved = async(req,res)=>{
   try{
      const buildings = await Building.find({isApproved:'Accepted'})
      res.json(buildings)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }   
}

buildingsCltr.approve = async(req,res)=>{
   try{
      const id = req.params.id
      const building = await Building.findByIdAndUpdate({_id:id},{isApproved:'Accepted'},{new:true})
      if(!building){
         res.status(400).json({message:'Record not found'})
      }
      const email = req.body.email
      console.log(email)
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: 'truptirao00@gmail.com',
           pass: 'yroo edlq nfdi mkuu'
         }
      })
      const mailOptions = {
         from: 'truptirao00@gmail.com',
         to: `${email}`,
         subject: 'Approval of Your Paying Guest Building',
         text: `Dear Owner,\n\nWe are pleased to inform you that your Paying Guest building has been approved by our admin team at CozyHaven. Congratulations!\n\nYour building is now visible and accessible for further management on our platform. You can proceed to manage your building, view details, and make any necessary updates as needed.\n\nThank you for choosing CozyHaven for your property management needs. If you have any questions or require assistance, please feel free to reach out to our support team.\n\nBest regards,\n\nCozy Haven`,
       }
      transporter.sendMail(mailOptions, function(error, info){
         if (error) {
            console.log(error);
         } else {
            console.log('Email sent: ' + info.response);
         }
      });  
      res.json(building)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

buildingsCltr.disapprove = async(req,res)=>{
   try{
      const id = req.params.id
      const building = await Building.findByIdAndUpdate({_id:id},{isApproved:'Rejected'},{new:true})
      const email = req.body.email
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: 'truptirao00@gmail.com',
           pass: 'yroo edlq nfdi mkuu'
         }
      })
      const mailOptions = {
         from: 'truptirao00@gmail.com',
         to: `${email}`,
         subject: 'Notification Regarding Your Paying Guest Building',
         text: `Dear Owner,\n\nWe regret to inform you that your Paying Guest building submission has been rejected by our admin team at CozyHaven.\n\nUnfortunately, your building does not meet our criteria for approval at this time. If you have any questions or need further clarification, please don't hesitate to reach out to our support team.\n\nThank you for considering CozyHaven for your property management needs.\n\nBest regards,\n\nCozy Haven`,
         }
      transporter.sendMail(mailOptions, function(error, info){
         if (error) {
            console.log(error);
         } else {
            console.log('Email sent: ' + info.response);
         }
      });
      res.json(building)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

buildingsCltr.search = async (req,res) => {
   try {
      console.log(req.query)
      const search = req.query.address || ""
      const gender = req.query.gender || ""
      const sharing = req.query.sharing || ""
      // // let amenities = req.query.amenities || "All"
      // // let a = amenities.split(',').map(ele => new ObjectId(ele))
      // // console.log(a)
      // const amenitiesOption = await Amenity.find()
      // amenities = amenities === "All" ? amenitiesOption.map(option => option._id) : amenities.split(',');
      //console.log(amenitiesOption.map(ele =>(ele._id)).forEach(ele =>  ele))
      //buildings based on address & gender
      const buildings1 = await Building.find({address: { $regex: search, $options: "i" },...(gender && { gender: gender })})
      const buildings1Id = buildings1.map(ele => ele._id)
      //address: { $regex: search, $options: "i" },gender,
      //amenities: { $in: a 
      // .where("amenities")
      // .in([...amenities])

      const rooms = await Room.find({buildingId: {$in: buildings1Id},sharing})
      const buildingIds = rooms.map(ele => ele.buildingId)
      //buildings based on sharing
      const buildings2 = await Building.find({_id: {$in: buildingIds}})

      //combine both & remove duplicate copies of the same building
      const combinedBuildings = buildings1.concat(buildings2)
      const uniqueBuildingsId = []
      const filterdBuildings = combinedBuildings.filter(ele => {
         if(!uniqueBuildingsId.includes(ele._id.toString())) {
            uniqueBuildingsId.push(ele._id.toString())
            return true
         } else {
            return false
         }
      })
      //console.log(filterdBuildings.map(ele => ele._id))

      const response = {
         error: false,
         //amenitiess: amenitiesOption.map(ele =>new ObjectId(ele._id)),
         buildingIds,
         filterdBuildings
      }
      res.json(response)

   } catch(err) {
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

module.exports = buildingsCltr

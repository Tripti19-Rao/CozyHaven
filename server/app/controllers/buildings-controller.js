const { validationResult } = require('express-validator')
const {pick} = require('lodash')
const Building = require('../models/buildings-model')
const nodemailer = require('nodemailer');
const buildingsCltr= {}
const Room = require('../models/rooms-model');
const cloudinary = require('../middlewares/cloudinary')


buildingsCltr.create = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }
   try {
       const body = pick(req.body, ['name', 'address', 'contact', 'deposit', 'rules', 'geolocation.lat', 'geolocation.lng', 'amenities', 'gender']);

       // Check if files were uploaded
       if (!req.files || Object.keys(req.files).length === 0) {
           return res.status(400).json({ message: 'No files were uploaded.' });
       }

       // Function to upload a single image to Cloudinary with specified folder name
       const singleImageUpload = async (file, folderName) => {
           const result = await cloudinary.uploader.upload(file.path, { folder: folderName });
           return {
               url: result.secure_url,
               cloudinary_id: result.public_id
           };
       };

       // Upload profile picture to 'Profile' folder
       const profilePic = await singleImageUpload(req.files.profilePic[0], 'Profile');

       // Upload license image to 'License' folder
       const license = await singleImageUpload(req.files.license[0], 'License');

       // Function to upload multiple images to Cloudinary with specified folder name
       const multipleImagesUpload = async (files, folderName) => {
           const uploadedImages = [];
           for (const file of files) {
               const result = await cloudinary.uploader.upload(file.path, { folder: folderName });
               uploadedImages.push({
                   url: result.secure_url,
                   cloudinary_id: result.public_id
               });
           }
           return uploadedImages;
       };

       // Upload amenities pictures to 'Amenities' folder
       const amenitiesPic = await multipleImagesUpload(req.files.amenitiesPic, 'Amenities');

       // Create a new Building object
       const building = new Building(body);
       building.ownerId = req.user.id;
       building.profilePic = profilePic.url;
       building.license = license.url;
       building.amenitiesPic = amenitiesPic.map(pic => pic.url);
       await building.save();

       // Respond with the saved building object
       res.status(200).json(building);
   } catch (err) {
       console.log(err);
       res.status(500).json({ error: 'Internal Server Error' });
   }
};


buildingsCltr.list = async(req,res)=>{
   const id = req.user.id
   try{
      const buildings = await Building.find({ownerId:id}).populate('rooms.roomid').populate('amenities',['name'])
      if(!buildings){
        return res.status(200).json('You dont own any building yet')
      }
      res.json(buildings)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }   
}

buildingsCltr.listOne = async(req,res)=>{
   const id = req.user.id
   try{
      const buildings = await Building.find({ownerId:id}).populate('rooms.roomid',['_id','roomNo','sharing','amount','pic','guest'])
      if(!buildings){
         return res.status(200).json('You dont have any buildings to show yet')
      }
      res.json(buildings)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

buildingsCltr.listOneBuilding = async (req,res) => {
   const id = req.params.id
   try {
      const building = await Building.findOne({_id: id}).populate('rooms.roomid',['_id','roomNo','sharing','amount','pic','guest']).populate('amenities',['name','iconName'])
      if(!building) {
         return res.status(404).json({error: 'Record Not Found'})
      }
      return res.status(200).json(building)
   } catch(err){
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


buildingsCltr.updateAmenities = async(req, res)=>{
   try{
      const multipleImagesUpload = async (files) => {
         const uploadedImages = [];
         for (const file of files) {
             const result = await cloudinary.uploader.upload(file.path, { folder: 'Amenities' });
             uploadedImages.push({
                 url: result.secure_url,
                 cloudinary_id: result.public_id
             });
         }
         return uploadedImages;
     };
      const amenitiesPic = await multipleImagesUpload(req.files.amenitiesPic);
   
      const amenitiesPictures = amenitiesPic.map(pic => pic.url);
      res.status(200).json(amenitiesPictures)
   }
   catch(err){
            res.status(500).json({error:'Internal Server Error'})
   }
}

buildingsCltr.updateProfilePic = async(req, res)=>{
   try{
      const singleImageUpload = async (file) => {
         const result = await cloudinary.uploader.upload(file.path, { folder: 'Profile' });
         return {
             url: result.secure_url,
             cloudinary_id: result.public_id
         };
     };
     const profilePic = await singleImageUpload(req.files.profilePic[0]); 
   
      const profilePicture = profilePic.url
      res.status(200).json(profilePicture)
   }
   catch(err){
            res.status(500).json({error:'Internal Server Error'})
   }
}


buildingsCltr.updateLicense = async(req, res)=>{
   try{
      const singleImageUpload = async (file) => {
         const result = await cloudinary.uploader.upload(file.path, { folder: 'License' });
         return {
             url: result.secure_url,
             cloudinary_id: result.public_id
         };
     };
     const license = await singleImageUpload(req.files.license[0]); 
   
      const licensePicture = license.url
      res.status(200).json(licensePicture)
   }
   catch(err){
            res.status(500).json({error:'Internal Server Error'})
   }
}


buildingsCltr.update = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
 
   try {
     const body = pick(req.body, ['name', 'address', 'contact', 'deposit', 'rules', 'geolocation.lat', 'geolocation.lng', 'amenities', 'gender','amenitiesPic', 'license', 'profilePic']);
     const building = await Building.findByIdAndUpdate(req.params.id, body, { new: true });
     res.status(200).json(building);
}
    catch (err) {
     console.log(err);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 };
 

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
            user: process.env.SECRET_EMAIL,
            pass: process.env.SECRET_PASSWORD
         }
      })
      const mailOptions = {
         from: process.env.SECRET_EMAIL,
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
            user: process.env.SECRET_EMAIL,
            pass: process.env.SECRET_PASSWORD
         }
      })
      const mailOptions = {
         from: process.env.SECRET_EMAIL,
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
      const search = req.query.address || ""
      const gender = req.query.gender || ""
      const amenities = req.query.amenities ? req.query.amenities.split(',') : [];
      const order = req.query.price || ''
      const sharing = req.query.sharing ? parseInt(req.query.sharing) : undefined
      let page = req.query.page || 1
      let limit = req.query.limit || 5
      page = parseInt(page)
      limit = parseInt(limit)
      const searchQuery = {
         address: {$regex: search, $options: 'i'}, 
         ...gender && {gender: gender}, 
         ...amenities.length > 0 && {amenities: { $in: amenities }},
         isApproved:'Accepted',
      }

      let buildings = await Building.find().populate('rooms.roomid',['sharing'])
         .find(searchQuery)
         
         
      if(sharing) {
         const buildingsMatchingSharing = buildings.filter(building => {
            return building.rooms.some(ele => ele.roomid.sharing == sharing)
         }).map(ele => ele._id)
   
         buildings = await Building.find({'_id': {$in: buildingsMatchingSharing}}).populate('amenities',['_id','name','iconName']).populate('rooms.roomid',['_id','roomNo','sharing','amount','pic','guest'])
      } else {
         buildings = await Building.find(searchQuery).populate('amenities',['_id','name','iconName']).populate('rooms.roomid',['_id','roomNo','sharing','amount','pic','guest'])
      }

      buildings.sort((a, b) => {
         const lowestAmountA = Math.min(...a.rooms.map(room => room.roomid.amount));
         const lowestAmountB = Math.min(...b.rooms.map(room => room.roomid.amount));
         
         if (order === 'asc') {
           return lowestAmountA - lowestAmountB;
         } else {
           return lowestAmountB - lowestAmountA;
         }
       });
       
       const total = buildings.length
       // Pagination
       buildings = buildings.slice((page - 1) * limit, page * limit);

      res.json(
         {
         buildings,
         pagination:  {
            total,
            page,
            totalPages: Math.ceil(total / limit)
         }
      
      }
      )      
   } catch(err) {
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

buildingsCltr.getData = async(req,res)=>{
   try{
      const buildings = await Building.find()
      res.json(buildings)
   }catch(err){
      console.log(err)
      res.status(500).json({error:'Internal Server Error'})
   }
}

module.exports = buildingsCltr

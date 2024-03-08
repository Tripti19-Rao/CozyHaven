const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function (req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = path.extname(file.originalname)
        const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension
        cb(null, fileName) 
    }
})
const upload = multer({storage:storage})

// const createImage = (req,res,next)=>{
//     try{
//         upload.fields([
//             {name: 'profilePic' ,maxCount: 1},
//             {name: 'amenitiesPic'},
//             {name: 'license',maxCount:3}
//         ])
//         next()
//     }catch(err){
//         res.status(500).json({errors:"Internal server"})
//     }
// }

module.exports = upload
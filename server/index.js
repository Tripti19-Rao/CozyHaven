require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {checkSchema} = require('express-validator')
const app = express()
const port  = 3055
app.use(express.json())
app.use(cors())

const configDB = require('./config/database')
configDB()


//Controllers
const UserCltr = require('./app/controllers/user-controller')
const BuildingCltr = require('./app/controllers/building-controller')
const reviewsCltr = require('./app/controllers/reviews-controller')
// const RoomCltr = require('./app/controllers/room-controller')

//Middlewares
const {authenticateUser} = require('./app/middlewares/auth')
const {authoriseUser} = require('./app/middlewares/auth')
const upload = require('./app/middlewares/multer')
const fetcher = require('./app/middlewares/fetcher')
//Validations
const {userRegisterSchemaValidation} = require('./app/validators/user-validation')
const {userLoginSchemaValidation} = require('./app/validators/user-validation')
const buildingSchemaValidations = require('./app/validators/building-validation')
const getData = require('./app/middlewares/fetcher')
// const roomSchemaValidation = require('./app/validators/room-validation')



app.post('/api/user/register',checkSchema(userRegisterSchemaValidation),UserCltr.register)
app.post('/api/user/login',checkSchema(userLoginSchemaValidation), UserCltr.login)

//Owner 
app.post('/api/buildings',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'profilePic' ,maxCount: 1},
    {name: 'amenitiesPic'},
    {name: 'license'}
]), checkSchema(buildingSchemaValidations),BuildingCltr.create)
app.get('/api/buildings',authenticateUser,authoriseUser(['owner']),BuildingCltr.list)
app.delete('/api/buildings/:id',authenticateUser,authoriseUser(['owner']),BuildingCltr.destroy)
app.put('/api/buildings/:id',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'profilePic' ,maxCount: 1},
    {name: 'amenitiesPic'},
    {name: 'license'}
]),checkSchema(buildingSchemaValidations),BuildingCltr.update)


// app.post('/api/rooms',authenticateUser,authoriseUser(['owner']),checkSchema(roomSchemaValidation),RoomCltr.create)
// app.get('/api/rooms/:id',authenticateUser,authoriseUser(['owner']),RoomCltr.list)


//Reviews
app.post('/api/:buildingid/reviews',authenticateUser,authoriseUser(['finder']),getData,reviewsCltr.create)


app.listen(port , ()=>{
    console.log("server running on port " + port)
})



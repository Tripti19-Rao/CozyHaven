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
const roomsCltr = require('./app/controllers/room-controller')
const amenitiesCltr = require('./app/controllers/amenities-controller')
const paymentsCltr = require('./app/controllers/payments-controller')
const transactionsCltr = require('./app/controllers/transactions-controller')
const guestsCltr = require('./app/controllers/guests-controller')

//Middlewares
const {authenticateUser,authoriseUser} = require('./app/middlewares/auth')
const upload = require('./app/middlewares/multer')
const {getUserName, getOwnerId} = require('./app/middlewares/fetcher')

//Validations
const {userRegisterSchemaValidation, userLoginSchemaValidation} = require('./app/validators/user-validation')
const buildingSchemaValidations = require('./app/validators/building-validation')
const roomsValidationSchema = require('./app/validators/rooms-validation')
const {reviewsValidationSchema, reviewsUpdateValidationSchema} = require('./app/validators/reviews-validation')
const amenitiesValidationSchema = require('./app/validators/amenities-validation')
const paymentsValidationSchema = require('./app/validators/payments-validation')
const transactionValdiationSchema = require('./app/validators/transactions-validation')
const guestsValidationSchema = require('./app/validators/guests-validation')


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



//Rooms
app.post('/api/:buildingid/rooms',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'pic'}
]),checkSchema(roomsValidationSchema),roomsCltr.create)
app.get('/api/:buildingid/rooms',authenticateUser,authoriseUser(['owner']),roomsCltr.list)
app.put('/api/:buildingid/rooms/:id',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'pic'}
]),checkSchema(roomsValidationSchema),roomsCltr.update)
app.delete('/api/:buildingid/rooms/:id',authenticateUser,authoriseUser(['owner']),roomsCltr.destroy)


//Amenities
app.post('/api/amenities',authenticateUser,authoriseUser(['admin']),checkSchema(amenitiesValidationSchema),amenitiesCltr.create)
app.get('/api/amenities',authenticateUser,amenitiesCltr.list)
app.put('/api/amenities/:id',authenticateUser,authoriseUser(['admin']),checkSchema(amenitiesValidationSchema),amenitiesCltr.update)
app.delete('/api/amenities/:id',authenticateUser,authoriseUser(['admin']),amenitiesCltr.destroy)


//Guests
app.post('/api/:buildingid/:roomid/guests',authenticateUser,authoriseUser(['finder']),upload.fields([
    {name: 'aadharPic'}
]),checkSchema(guestsValidationSchema),getOwnerId,guestsCltr.create)
app.get('/api/:buildingid/guests',authenticateUser,authoriseUser(['owner']),guestsCltr.list)
app.put('/api/:buildingid/guests/:id',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'aadharPic'}
]),checkSchema(guestsValidationSchema),guestsCltr.update)
app.delete('/api/:buildingid/guests/:id',authenticateUser,authoriseUser(['owner']),guestsCltr.destroy)


//Reviews
app.post('/api/:buildingid/reviews',authenticateUser,authoriseUser(['finder']),getUserName,checkSchema(reviewsValidationSchema),reviewsCltr.create)
app.get('/api/:buildingid/reviews',reviewsCltr.list)
app.put('/api/:buildingid/reviews/:reviewid',authenticateUser,authoriseUser(['finder']),checkSchema(reviewsUpdateValidationSchema),reviewsCltr.update)
app.delete('/api/:buildingid/reviews/:reviewid',authenticateUser,authoriseUser(['finder']),reviewsCltr.destroy)


//Payment
app.post('/api/:buildingid/payment/:roomid',authenticateUser,authoriseUser(['finder']),paymentsCltr.create)
app.get('/api/:buildingid/payments',authenticateUser,authoriseUser(['owner']),paymentsCltr.list)
app.get('/api/:buildingid/payment/:paymentid',authenticateUser,authoriseUser(['owner']),paymentsCltr.listone)


//Transcation
app.post('/api/transaction',checkSchema(transactionValdiationSchema),transactionsCltr.create)


app.listen(port , ()=>{
    console.log("server running on port " + port)
})



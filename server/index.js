//Dependencies
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {checkSchema} = require('express-validator')
const app = express()
const port  = 3055

//Aplication level Middlewares
app.use(express.json())
app.use(cors())

//Configuring Database
const configDB = require('./config/database')
configDB()

//Controllers
const usersCltr = require('./app/controllers/users-controller')
const buildingsCltr = require('./app/controllers/buildings-controller')
const reviewsCltr = require('./app/controllers/reviews-controller')
const roomsCltr = require('./app/controllers/rooms-controller')
const amenitiesCltr = require('./app/controllers/amenities-controller')
const paymentsCltr = require('./app/controllers/payments-controller')
const InvoicesCltr = require('./app/controllers/invoices-controller')
const guestsCltr = require('./app/controllers/guests-controller')

//Route level Middlewares
const {authenticateUser,authoriseUser} = require('./app/middlewares/auth')
const upload = require('./app/middlewares/multer')
const {getUserName, getOwnerId, getOwnerEmail} = require('./app/middlewares/fetcher')

//Validations
const {userRegisterValidationSchema, userLoginValidationSchema} = require('./app/validators/users-validation')
const {buildingsValidationSchema,buildingsAprrovalValidationSchema} = require('./app/validators/buildings-validation')
const roomsValidationSchema = require('./app/validators/rooms-validation')
const {reviewsValidationSchema, reviewsUpdateValidationSchema} = require('./app/validators/reviews-validation')
const amenitiesValidationSchema = require('./app/validators/amenities-validation')
const paymentsValidationSchema = require('./app/validators/payments-validation')
const invoicesValdiationSchema = require('./app/validators/invoices-validation')
const guestsValidationSchema = require('./app/validators/guests-validation')

//Routes

//User Register
app.post('/api/user/register',checkSchema(userRegisterValidationSchema),usersCltr.register)

//User Login
app.post('/api/user/login',checkSchema(userLoginValidationSchema), usersCltr.login)


//ADMIN 
//Approval of building

//list all the building whoes approval is Pending
app.get('/api/buildings/approval',authenticateUser,authoriseUser(['admin']),buildingsCltr.listPendingApproval)

//list all the building whoes approval is Accepted
app.get('/api/buildings/approved',authenticateUser,authoriseUser(['admin']),buildingsCltr.approved)

//change the aprroval status to Accepted
app.put('/api/building/set-approval/:id',authenticateUser,authoriseUser(['admin']),getOwnerEmail,buildingsCltr.approve)

//change the approval status to Rejected
app.put('/api/building/change-approval/:id',authenticateUser,authoriseUser(['admin']),getOwnerEmail,buildingsCltr.disapprove)

//OWNER - BUILDING 
//Create Building
app.post('/api/buildings',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'profilePic' ,maxCount: 1},
    {name: 'amenitiesPic'},
    {name: 'license'}
]), checkSchema(buildingsValidationSchema),buildingsCltr.create)

//Listing Buildings
app.get('/api/buildings',authenticateUser,authoriseUser(['owner']),buildingsCltr.list)

//Delete Building
app.delete('/api/buildings/:id',authenticateUser,authoriseUser(['owner']),buildingsCltr.destroy)

//Update Building
app.put('/api/buildings/:id',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'profilePic' ,maxCount: 1},
    {name: 'amenitiesPic'},
    {name: 'license'}
]),checkSchema(buildingsValidationSchema),buildingsCltr.update)


//ROOM
//Create Room
app.post('/api/:buildingid/rooms',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'pic'}
]),checkSchema(roomsValidationSchema),roomsCltr.create)

//Listing Rooms
app.get('/api/:buildingid/rooms',authenticateUser,authoriseUser(['owner']),roomsCltr.list)

//Update Room
app.put('/api/:buildingid/rooms/:id',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'pic'}
]),checkSchema(roomsValidationSchema),roomsCltr.update)

//Delete Room
app.delete('/api/:buildingid/rooms/:id',authenticateUser,authoriseUser(['owner']),roomsCltr.destroy)


//ADMIN - AMENITIES
//Create Amenity
app.post('/api/amenities',authenticateUser,authoriseUser(['admin']),checkSchema(amenitiesValidationSchema),amenitiesCltr.create)

//Listing Amenities
app.get('/api/amenities',authenticateUser,amenitiesCltr.list)

//Update Amenity
app.put('/api/amenities/:id',authenticateUser,authoriseUser(['admin']),checkSchema(amenitiesValidationSchema),amenitiesCltr.update)

//Delete Amenity
app.delete('/api/amenities/:id',authenticateUser,authoriseUser(['admin']),amenitiesCltr.destroy)


//GUEST
//Create Guest
app.post('/api/:buildingid/:roomid/guests',authenticateUser,authoriseUser(['finder']),upload.fields([
    {name: 'aadharPic'}
]),checkSchema(guestsValidationSchema),getOwnerId,guestsCltr.create)

//Listing Guests
app.get('/api/:buildingid/guests',authenticateUser,authoriseUser(['owner']),guestsCltr.list)

//Update Guest
app.put('/api/:buildingid/guests/:id',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'aadharPic'}
]),checkSchema(guestsValidationSchema),guestsCltr.update)

//Delete Guest
app.delete('/api/:buildingid/guests/:id',authenticateUser,authoriseUser(['owner']),guestsCltr.destroy)


//REVIEWS
//Create Review
app.post('/api/:buildingid/reviews',authenticateUser,authoriseUser(['finder']),getUserName,checkSchema(reviewsValidationSchema),reviewsCltr.create)

//Listing Reviews
app.get('/api/:buildingid/reviews',reviewsCltr.list)

//Update Review
app.put('/api/:buildingid/reviews/:reviewid',authenticateUser,authoriseUser(['finder']),checkSchema(reviewsUpdateValidationSchema),reviewsCltr.update)

//Delete Review
app.delete('/api/:buildingid/reviews/:reviewid',authenticateUser,authoriseUser(['finder']),reviewsCltr.destroy)


//PAYMENT
//Create Payment
app.post('/api/create-checkout-session',authenticateUser,authoriseUser(['finder']),paymentsCltr.pay)

//Listing Payments
app.get('/api/:buildingid/payments',authenticateUser,authoriseUser(['owner']),paymentsCltr.list)

//Listing particular Payment
app.get('/api/:buildingid/payment/:paymentid',authenticateUser,authoriseUser(['owner']),paymentsCltr.listOne)


//INVOICE
//Create Invoice
app.post('/api/building/:buildingid/room/:roomid/invoice',authenticateUser,authoriseUser(['finder']),checkSchema(invoicesValdiationSchema),InvoicesCltr.create)


//LISTENING
app.listen(port , ()=>{
    console.log("server running on port " + port)
})




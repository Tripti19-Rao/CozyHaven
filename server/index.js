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
const cronPaymentJob = require('./config/cronTask/paymentCron')
configDB()
//cronPaymentJob()

//Controllers
const usersCltr = require('./app/controllers/users-controller')
const buildingsCltr = require('./app/controllers/buildings-controller')
const reviewsCltr = require('./app/controllers/reviews-controller')
const roomsCltr = require('./app/controllers/rooms-controller')
const amenitiesCltr = require('./app/controllers/amenities-controller')
const paymentsCltr = require('./app/controllers/payments-controller')
const InvoicesCltr = require('./app/controllers/invoices-controller')
const guestsCltr = require('./app/controllers/guests-controller')
const findersCltr = require('./app/controllers/finders-controller')

//Route level Middlewares
const {authenticateUser,authoriseUser} = require('./app/middlewares/auth')
const upload = require('./app/middlewares/multer')
const {getUserName, getOwnerId, getOwnerEmail} = require('./app/middlewares/fetcher')

//Validations
const {userRegisterValidationSchema, userLoginValidationSchema} = require('./app/validators/users-validation')
const {buildingsValidationSchema,buildingsEditValidationSchema,buildingsAprrovalValidationSchema} = require('./app/validators/buildings-validation')
const roomsValidationSchema = require('./app/validators/rooms-validation')
const {reviewsValidationSchema, reviewsUpdateValidationSchema} = require('./app/validators/reviews-validation')
const amenitiesValidationSchema = require('./app/validators/amenities-validation')
const paymentsValidationSchema = require('./app/validators/payments-validation')
const invoicesValdiationSchema = require('./app/validators/invoices-validation')
const guestsValidationSchema = require('./app/validators/guests-validation')

//Routes

//route for example payment
app.get('/api/pay',cronPaymentJob.pay)

//User Register
app.post('/api/users/register',checkSchema(userRegisterValidationSchema),usersCltr.register)

//User Login
app.post('/api/users/login',checkSchema(userLoginValidationSchema), usersCltr.login)

//User Account 
app.get('/api/users/account',authenticateUser,authoriseUser(['admin','owner','finder']),usersCltr.account)


//ADMIN 
//Approval of building

//Admin getting all chart data
app.get('/api/chart/users',authenticateUser,authoriseUser(['admin']),usersCltr.getData )
 
//List all the building for charts
app.get('/api/chart/buildings',authenticateUser,authoriseUser(['admin']),buildingsCltr.getData)

//list all the building whoes approval is Pending
app.get('/api/buildings/approval',authenticateUser,authoriseUser(['admin']),buildingsCltr.listPendingApproval)

//list all the building whoes approval is Accepted - not required
app.get('/api/buildings/approved',authenticateUser,authoriseUser(['admin']),buildingsCltr.approved)

//change the aprroval status to Accepted
app.put('/api/buildings/set-approval/:id',authenticateUser,authoriseUser(['admin']),getOwnerEmail,buildingsCltr.approve)

//change the approval status to Rejected
app.put('/api/buildings/change-approval/:id',authenticateUser,authoriseUser(['admin']),getOwnerEmail,buildingsCltr.disapprove)

//OWNER - BUILDING 
//Create Building
app.post('/api/buildings',authenticateUser,authoriseUser(['owner']),upload.fields([
    {name: 'profilePic' ,maxCount: 1},
    {name: 'amenitiesPic'},
    {name: 'license'}
]), checkSchema(buildingsValidationSchema),buildingsCltr.create)

//Listing Buildings
// app.get('/api/buildings',authenticateUser,authoriseUser(['owner']),buildingsCltr.list)

//List a owners buildings
app.get('/api/buildings',authenticateUser,authoriseUser(['owner']),buildingsCltr.listOne)

//List One Building
app.get('/api/buildings/one/:id',authenticateUser,authoriseUser(['finder']),buildingsCltr.listOneBuilding)


//Delete Building
app.delete('/api/buildings/:id',authenticateUser,authoriseUser(['owner']),buildingsCltr.destroy)


//Edit a building
app.put('/api/buildings/:id',authenticateUser,authoriseUser(['owner']),buildingsCltr.update)

//Editing amenties images uplaod
app.post('/api/images/amenities',authenticateUser,authoriseUser(['owner']),
upload.fields([
    {name: 'amenitiesPic'}
]),buildingsCltr.updateAmenities)

//Editing profile image uplaod
app.post('/api/images/profile',authenticateUser,authoriseUser(['owner']),
upload.fields([
    {name: 'profilePic', maxCount: 1}
]),buildingsCltr.updateProfilePic)

//Editing license images uplaod
app.post('/api/images/license',authenticateUser,authoriseUser(['owner']),
upload.fields([
    {name: 'license'}
]),buildingsCltr.updateLicense)

//Editing roomspic upload
app.post('/api/images/roompic',authenticateUser,authoriseUser(['owner']),
upload.fields([
    {name: 'pic'}
]),roomsCltr.updateRoompics)


//Searching Buildings
app.get('/api/search',buildingsCltr.search)


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

//Finder
//Create Finder
app.post('/api/finders',authenticateUser,authoriseUser(['finder']),findersCltr.create)

//Listing Finder
app.get('/api/finders',authenticateUser,authoriseUser(['finder']),findersCltr.list)

//Updating Finder
app.put('/api/finders',authenticateUser,authoriseUser(['finder']),findersCltr.update)

//Getting One Finder
app.get('/api/finders/findOne',authenticateUser,authoriseUser(['finder']),findersCltr.listOne)

//Getting Wishlist of one Finder
app.get('/api/finders/wishlist',authenticateUser,authoriseUser(['finder']),findersCltr.listWishlist)

//my pg
app.get('/api/finders/:id/my', authenticateUser, authoriseUser(['finder']),findersCltr.mine)


//GUEST
//Create Guest
app.post('/api/:buildingid/:roomid/guests',authenticateUser,authoriseUser(['finder']),upload.fields([
    {name: 'aadharPic'},
    {name: 'profile'}
]),checkSchema(guestsValidationSchema),getOwnerId,guestsCltr.create)

//Listing Guests
app.get('/api/:buildingid/guests',authenticateUser,authoriseUser(['owner']),guestsCltr.list)

//List Pending Guests Registeration for one finder
app.get('/api/guests/pending-registration',authenticateUser,authoriseUser(['finder']),guestsCltr.listPendingReg)

//Update Guest
app.put('/api/buildings/:buildingid/guests',authenticateUser,authoriseUser(['finder']),upload.fields([
    {name: 'profile'},
    {name: 'aadharPic'}
]),checkSchema(guestsValidationSchema),guestsCltr.update)

//Delete Guest - stay false
app.put('/api/stay/:buildingid/guests/:id',authenticateUser,authoriseUser(['owner']),guestsCltr.destroy)

//Check if guest
app.get('/api/:buildingid/member/:finderid',authenticateUser,authoriseUser(['finder']),guestsCltr.check)

//Get status statistics
app.get('/api/chart/status/:buildingid',guestsCltr.status)


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
app.post('/api/create-checkout-session',authenticateUser,authoriseUser(['finder']),checkSchema(paymentsValidationSchema),paymentsCltr.pay)

//Listing Payments - for whom?
app.get('/api/:buildingid/payments',authenticateUser,authoriseUser(['owner']),paymentsCltr.list)

//Listing particular Payment
app.get('/api/:buildingid/payment/:paymentid',authenticateUser,authoriseUser(['finder']),paymentsCltr.listOne)

//Updating Payment
app.put('/api/payments/update/:stripId',authenticateUser,authoriseUser(['finder']),paymentsCltr.update)

//Updating payment using payment id
app.put('/api/payments/:paymentid',authenticateUser,authoriseUser(['finder']),paymentsCltr.updateUsingPaymentId)

//INVOICE 
//Create Invoice
app.post('/api/invoice',authenticateUser,authoriseUser(['finder']),checkSchema(invoicesValdiationSchema),InvoicesCltr.create)

//Get Invoice
app.get('/api/invoice/:id',authenticateUser,authoriseUser(['finder']),InvoicesCltr.list)

//Delete Invoice
app.delete('/api/invoice/:id',authenticateUser,authoriseUser(['finder']),InvoicesCltr.destroy)


//LISTENING
app.listen(port , ()=>{
    console.log("server running on port " + port)
})




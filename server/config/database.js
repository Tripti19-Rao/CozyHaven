const mongoose = require('mongoose')

const configDB = async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/cozyhaven')
        console.log("Succesfully connected to db")
    } catch(err){
        console.log("error connecting to db")
    }
}

module.exports = configDB
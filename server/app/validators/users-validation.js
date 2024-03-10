const User = require("../models/users-model")

const userRegisterValidationSchema = {
    username:{
        notEmpty:{
            errorMessage:'Username is required'
        },
        trim:true,
        escape:true
    },
    email:{
        notEmpty:{
            errorMessage:'Email is required'
        },
        isEmail:{
            errorMessage:'Invalid email'
        },
        custom:{
            options: async function(value){
                const user = await User.findOne({email:value})
                if(!user){
                    return true
                }
                else{
                    throw new Error('Email already exists')
                }
            }
        },
        trim:true,
        normalizeEmail:true,
        escape:true
    },
    role:{
        notEmpty:{
            errorMessage:'Role is required'
        },
        isIn:{
            options:[['admin','finder','owner']],
            errorMessage:'Role is required'
        },
        trim:true,
        escape:true
    },
    password:{
        notEmpty:{
            errorMessage:'Password is required'
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'Password should be between 8 to 128 characters long'
        },
        trim:true,
        escape:true
    }
}

const userLoginValidationSchema={
    email:{
        notEmpty:{
            errorMessage:'Email is required'
        },
        isEmail:{
            errorMessage:'Invalid email'
        },
        escape:true
    },
    password:{
        notEmpty:{
            errorMessage:'Password is required'
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'Password should be between 8 to 128 characters long'
        },
        trim:true,
        escape:true
    }
}

module.exports = {
    userRegisterValidationSchema,
    userLoginValidationSchema
}
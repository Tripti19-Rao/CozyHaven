const buildingSchemaValidations = {

    name:{
        notEmpty:{
            errorMessage:'Name is required'
        },
        trim:true
    },
    address:{
        notEmpty:{
            errorMessage:'Address is required'
        },
        trim:true
    },
    deposit:{
        notEmpty:{
            errorMessage:'Deposit is required'
        },
        trim:true
    },

    rules:{
        notEmpty:{
            errorMessage:'Rules is required'
        }
    }


}
module.exports = buildingSchemaValidations
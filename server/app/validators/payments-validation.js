const { estimatedDocumentCount } = require("../models/rooms-model")

const paymentsValidationSchema = {
    transactionId:{
        notEmpty:{
            errorMessage:'Payment Transaction ID cannot be empty'
        },
        trim:true,
        escape:true
    },
    paymentType:{
        notEmpty:{
            errorMessage:'Payment Transaction ID cannot be empty'
        },
        trim:true,
        escape:true
    },
    amount:{
        notEmpty:{
            errorMessage:'Payment Transaction ID cannot be empty'
        },
        trim:true,
        escape:true
    },
    type:{
        notEmpty:{
            errorMessage:'Payment Transaction ID cannot be empty'
        },
        trim:true,
        escape:true
    },
    status:{
        notEmpty:{
            errorMessage:'Status is required'
        },
        isIn : {
            options: [['Pending','Success','Failed']],
            errorMessage: 'Status should be within the given list'
        },
        trim:true,
        escape:true
    }
}

module.exports = paymentsValidationSchema
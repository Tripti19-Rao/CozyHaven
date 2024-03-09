const paymentsValidationSchema = {
    transactionId:{
        notEmpty:{
            errorMessage:'Payment Transaction ID cannot be empty'
        },
        trim:true,
        escape:true
    },
    payment:{
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
}

module.exports = paymentsValidationSchema
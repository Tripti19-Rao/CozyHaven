const paymentsValidationSchema = {
    invoiceId:{
        notEmpty:{
            errorMessage: 'invoice id is required'
        },
        isMongoId:{
            errorMessage: 'Should be a vaild mongoId'
        }
    },
    amount:{
        notEmpty: {
            errorMessage: 'Amount is required'
        },
        isNumeric: {
            errorMessage: 'Amount must be a Number'
        },
        trim: true,
        escape: true
    }
}

module.exports = paymentsValidationSchema
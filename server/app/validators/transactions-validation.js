const transactionsValdiationSchema = {
    amount:{
        notEmpty:{
            errorMessage:'Amount is required'
        },
        isNumeric:{
            errorMessage:'Amount should be a number'
        },
        trim:true,
        escape:true
    }
}

module.exports = transactionsValdiationSchema
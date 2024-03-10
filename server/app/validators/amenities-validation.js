const amenitiesValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: 'Name is required'
        },
        trim:true,
        escape:true
    }
}

module.exports = amenitiesValidationSchema
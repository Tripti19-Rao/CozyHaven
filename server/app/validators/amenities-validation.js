const amenitiesValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: 'name must not be empty'
        }
    },
    // url: {
    //     notEmpty: {
    //         errorMessage: 'url must not be empty'
    //     }
    // }
}

module.exports = amenitiesValidationSchema
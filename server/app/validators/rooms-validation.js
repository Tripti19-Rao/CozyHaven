const roomsValidationSchema = {
    roomNo: {
        notEmpty: {
            errorMessage: 'Room Number is required'
        },
        trim: true,
        escape: true
    },
    sharing: {
        notEmpty: {
            errorMessage: 'Sharing is required'
        },
        isNumeric: {
            errorMessage: 'sharing must be a Number'
        },
        trim: true,
        escape: true
    },
    amount: {
        notEmpty: {
            errorMessage: 'Amount is required'
        },
        isNumeric: {
            errorMessage: 'Amount must be a Number'
        },
        trim: true,
        escape: true
    },
    pic: {
        custom: {
            options: function(value,{req}){
                if(!req.files.pic) {
                    throw new Error('Room picture is required')
                }
                return true
            }
        },
        escape: true
    },
    guests: {
        custom: {
            options: function(value) {
                if(value) {
                    if(!value.every(ele => /^[0-9a-fA-F]{24}$/.test(ele))) {
                        throw new Error('Guest Id must be a valid id')
                    }
                }
                return true
            }
        },
        escape: true
    }
}

const roomsEditValidationSchema = {
    roomNo: {
        notEmpty: {
            errorMessage: 'Room Number is required'
        },
        trim: true,
        escape: true
    },
    sharing: {
        notEmpty: {
            errorMessage: 'Sharing is required'
        },
        isNumeric: {
            errorMessage: 'sharing must be a Number'
        },
        trim: true,
        escape: true
    },
    amount: {
        notEmpty: {
            errorMessage: 'Amount is required'
        },
        isNumeric: {
            errorMessage: 'Amount must be a Number'
        },
        trim: true,
        escape: true
    },
    pic: {
        notEmpty: {
            errorMessage: 'Picture is required'
        },
        escape: true
    },
    guests: {
        custom: {
            options: function(value) {
                if(value) {
                    if(!value.every(ele => /^[0-9a-fA-F]{24}$/.test(ele))) {
                        throw new Error('Guest Id must be a valid id')
                    }
                }
                return true
            }
        },
        escape: true
    }
}

module.exports = {
    roomsValidationSchema,
    roomsEditValidationSchema
}
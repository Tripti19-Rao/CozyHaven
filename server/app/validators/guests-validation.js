const guestsValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: 'Name is required'
        },
        trim: true,
        escape: true
    },
    gender: {
        notEmpty:{
            errorMessage:'Gender is required'
        },
        trim:true,
        escape:true,
        isIn : {
            options: [['male','female','others']],
            errorMessage: 'Gender should be selected from the given list'
        }
    },
    dob: {
        notEmpty: {
            errorMessage: 'Dob is required'
        },
        isDate: {
            errorMessage: 'Dob must be in the format of yyyy-mm-dd'
        },
        trim: true,
        escape: true
    },
    age: {
        notEmpty: {
            errorMessage: 'Age is required'
        },
        isNumeric: {
            errorMessage: 'Age must be a Number'
        },
        trim: true,
        escape: true
    },
    phoneNo: {
        notEmpty: {
            errorMessage: 'Phone Number is required'
        },
        isNumeric: {
            errorMessage: 'Phone Number must be a Number'
        },
        isLength: {
            options: {min: 10,max: 10},
            errorMessage: 'Phone Number must be 10 characters long'
        },
        trim: true,
        escape: true
    },
    address: {
        notEmpty: {
            errorMessage: 'Address is required'
        },
        trim: true,
        escape: true
    },
    aadharNo: {
        notEmpty: {
            errorMessage: 'addhar Number is required'
        },
        isNumeric: {
            errorMessage: 'addhar Number must be a number'
        },
        isLength: {
            options: {min: 12,max: 12},
            errorMessage: 'Aadhar Number must be 12 characters long'
        },
        trim: true,
        escape: true
    },
    aadharPic: {
        custom :{
            options: function(value,{req}){
                if(!req.files.aadharPic) {
                    throw new Error('Aadhar picture is required')
                }
                return true
            }
        },
        escape: true
    },
    qualification: {
        notEmpty: {
            errorMessage: 'Qualification is required'
        },
        trim: true,
        escape: true
    },
    guardian: {
        notEmpty: {
            errorMessage: 'Guardian is required'
        },
        trim: true,
        escape: true
    },
    guardianNo: {
        notEmpty: {
            errorMessage: 'Guardian Number is required'
        },
        isNumeric: {
            errorMessage: 'Guardian Number must be a Number'
        },
        isLength: {
            options: {min: 10,max: 10},
            errorMessage: 'Guardian Number must be 10 characters long'
        },
        trim: true,
        escape: true
    }
}

module.exports = guestsValidationSchema
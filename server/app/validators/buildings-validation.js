const buildingsValidationSchema = {
    profilePic:{
        custom:{
            options:function(value,{req}){
                if(!req.files.profilePic){
                    throw new Error('Profile picture is required')
                }
                return true
            }
        },
        escape:true
    },
    name:{
        notEmpty:{
            errorMessage:'Name is required'
        },
        trim:true,
        escape:true
    },
    gender: {
        notEmpty:{
            errorMessage:'Gender is required'
        },
        trim:true,
        escape:true,
        isIn : {
            options: [['male','female','co-living']],
            errorMessage: 'Gender should be selected from the given list'
        }
    },
    address:{
        notEmpty:{
            errorMessage:'Address is required'
        },
        trim:true,
        escape:true
    },
    deposit:{
        notEmpty:{
            errorMessage:'Deposit Amount is required'
        },
        isNumeric:{
            errorMessage:'Deposit Amount has to be a number'
        },
        custom:{
            options: function(value){
                if(value>0){
                    return true
                }
                else{
                    throw new Error('Deposit Amount has to be more than 0')
                }
            }
        },
        trim:true,
        escape:true
    },
    amenitiesPic:{
        custom:{
            options:function(value,{req}){
                if(!req.files.amenitiesPic){
                    throw new Error('Amenities pic is required')
                }
                return true
            }
        },
        escape:true
    },
    license:{
        custom:{
            options:function(value,{req}){
                if(!req.files.license){
                    throw new Error('License picture are required for apporval')
                }
                return true
            }
        },
        escape: true
    },
    'geolocation.lat':{
        notEmpty:{
            errorMessage:'Geolocation latitude is required'
        },
        isNumeric:{
            errorMessage:'Geolocation latitude should be a number'
        },
        trim:true,
        escape:true
    },
    'geolocation.lng':{
        notEmpty:{
            errorMessage:'Geolocation longitude is required'
        },
        isNumeric:{
            errorMessage:'Geolocation longitude should be a number'
        },
        trim:true,
        escape:true
    }
}

const buildingsEditValidationSchema = {
    profilePic:{
        notEmpty: {
            errorMessage: 'Profile Picture is required'
        }
    },
    name:{
        notEmpty:{
            errorMessage:'Name is required'
        },
        trim:true,
        escape:true
    },
    gender: {
        notEmpty:{
            errorMessage:'Gender is required'
        },
        trim:true,
        escape:true,
        isIn : {
            options: [['male','female','co-living']],
            errorMessage: 'Gender should be selected from the given list'
        }
    },
    address:{
        notEmpty:{
            errorMessage:'Address is required'
        },
        trim:true,
        escape:true
    },
    deposit:{
        notEmpty:{
            errorMessage:'Deposit Amount is required'
        },
        isNumeric:{
            errorMessage:'Deposit Amount has to be a number'
        },
        custom:{
            options: function(value){
                if(value>0){
                    return true
                }
                else{
                    throw new Error('Deposit Amount has to be more than 0')
                }
            }
        },
        trim:true,
        escape:true
    },
    amenitiesPic: {
        notEmpty: {
            errorMessage: 'Amenities Picture is required'
        }
    },    
    license:{
        notEmpty: {
            errorMessage: 'license Picture is required'
        }
    },
    'geolocation.lat':{
        notEmpty:{
            errorMessage:'Geolocation latitude is required'
        },
        isNumeric:{
            errorMessage:'Geolocation latitude should be a number'
        },
        trim:true,
        escape:true
    },
    'geolocation.lng':{
        notEmpty:{
            errorMessage:'Geolocation longitude is required'
        },
        isNumeric:{
            errorMessage:'Geolocation longitude should be a number'
        },
        trim:true,
        escape:true
    }
}

module.exports = {
    buildingsValidationSchema,
    buildingsEditValidationSchema
} 
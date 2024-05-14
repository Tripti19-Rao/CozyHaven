const reviewsValidationSchema = {
    stars:{
        notEmpty:{
            errorMessage:'Stars is required'
        },
        isIn:{
           options:[['0.5','1','1.5','2','2.5','3','3.5','4','4.5','5']], 
           errorMessage:'Stars should be within then given'
        },
        trim:true,
        escape:true
    },
    description:{
        isLength:{
            options:{min:0, max:500},
            errorMessage:'Description should be within 500 characters long'
        },
        trim:true,
        escape:true
    }
}

const reviewsUpdateValidationSchema = {
    stars:{
        notEmpty:{
            errorMessage:'Stars is required'
        },
        isIn:{
           options:[['0.5','1','1.5','2','2.5','3','3.5','4','4.5','5']], 
           errorMessage:'Stars should be within then given'
        },
        trim:true,
        escape:true
    },
    description:{
        notEmpty:{
            errorMessage:'Description is required'
        },
        isLength:{
            options:{min:10, max:500},
            errorMessage:'Description should be within 500 characters long'
        },
        trim:true,
        escape:true
    }
}

module.exports = {
    reviewsValidationSchema,
    reviewsUpdateValidationSchema
}
const reviewsValidationSchema = {
    name:{
        notEmpty:{
            errorMessage:'Name cannot be empty'
        },
        trim:true,
        escape:true
    },
    stars:{
        notEmpty:{
            errorMessage:'Stars cannot be empty'
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
            errorMessage:'Description cannot be empty'
        },
        isLength:{
            options:{min:10, max:500},
            errorMessage:'Description should be within 500 characters long'
        },
        trim:true,
        escape:true
    }
}
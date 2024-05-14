const invoicesValdiationSchema = {
    buildingId:{
        notEmpty:{
            errorMessage: 'Building id is required'
        },
        isMongoId:{
            errorMessage: 'Should be a vaild mongoId'
        }
    },
    roomId:{
        notEmpty:{
            errorMessage: 'Building id is required'
        },
        isMongoId:{
            errorMessage: 'Should be a vaild mongoId'
        }
    }
}

module.exports = invoicesValdiationSchema
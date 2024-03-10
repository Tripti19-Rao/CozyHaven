const Transaction = require('../models/transactions-model')
const {validationResult} = require('express-validator')
const transactionsCltr = {}

transactionsCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const {body} = req
        const transaction = new Transaction(body)
        await transaction.save()
        res.json(transaction)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = transactionsCltr
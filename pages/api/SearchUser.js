require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async(request,response) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    try{
        const Result = await DataList.find({UserName:request.body.UserName}) 
        if (Result.length == 0){
            response.status(200).send({status:true})
        }
        else{
            response.status(200).send({status:false})
        }
    }catch{
        response.status(500).send({status:'Server Error'})
    }
}
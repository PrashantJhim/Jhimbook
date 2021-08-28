require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async(request,response) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    try{
        const Result = await DataList.find({_id:request.body.id}) 
        response.status(200).send({status:true,Details:Result[0]})
    }catch{
        response.status(500).send({status:'Server Error'})
    }
}
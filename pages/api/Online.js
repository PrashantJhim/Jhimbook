require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async(request,response) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    const Result = await DataList.updateOne({_id:request.body.id},{$set:{Online:request.body.status}}) 
    response.status(200).send({status:true})
}
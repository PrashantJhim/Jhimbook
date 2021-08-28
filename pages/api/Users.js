require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async(request,response) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    const Result = await DataList.find().select({_id:1})
    response.status(200).send({status:true,Arr:Result})
    
}
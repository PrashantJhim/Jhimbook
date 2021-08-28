require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async(request,response) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    try{
        const Result = await DataList.find({Email:request.body.Email}) 
        const Id = Result[0]['_id']
        response.status(200).send({status:true,id:Id})
    }catch{
        response.status(500).send({status:'Server Error'})
    }
}
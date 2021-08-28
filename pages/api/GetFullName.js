const Schema = require('../database/Schema')
const Mongoose = require('mongoose')
export default async(req,res)=>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    const Details = await DataList.find({Email:req.body.Email}) 
    const FullName = Details[0]['FullName'] 
    if (Details.length != 0){
        res.status(200).send({status:true,FullName:FullName})
    }
    if (Details.length == 0){
        res.status(400).send({status:false})
    }
}
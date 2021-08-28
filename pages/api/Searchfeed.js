require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async (request, response) => {
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    try{
        const Result = await DataList.find().select({_id:1,FullName:1,ProfilePhoto:1})
        response.status(200).send({status:true,Arr:Result})
    }
    catch{
        response.status(400).send({status:false})
    }
    

}
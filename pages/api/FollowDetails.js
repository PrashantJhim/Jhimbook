require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async (request, response) => {
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    
        const Result = await DataList.find({Email:request.body.Email}) 
        if (Result.length == 0){
            response.status(200).send({status:false})
        }
        if (Result.length != 0){

            const ProfilePhoto = Result[0]['ProfilePhoto']
            const FullName = Result[0]['FullName']
            response.status(200).send({status:true , FullName:FullName,ProfilePhoto:ProfilePhoto})
        }
    

}
require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async (req,res) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    const GetProfile = await DataList.find({Email:req.body.Email}) 
    const GetProfilePhoto = GetProfile[0]['ProfilePhoto'] 
    res.status(200).send({status:true,Src:GetProfilePhoto})
}
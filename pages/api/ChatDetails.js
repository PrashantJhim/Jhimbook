require('../database/connection')
const Mongoose = require('mongoose')
const Schema = require('../database/Schema')
export default async (req,res) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    // For First Person
    const GetProfile1 = await DataList.find({_id:req.body.id1}) 
    const GetProfilePhoto1 = GetProfile1[0]['ProfilePhoto'] 
    const GetFullName1 = GetProfile1[0]['FullName']
    // For Second Person
    const GetProfile2 = await DataList.find({_id:req.body.id2}) 
    const GetProfilePhoto2 = GetProfile2[0]['ProfilePhoto'] 
    const GetFullName2 = GetProfile2[0]['FullName']

    // Friend1 object 
    let Friend1 = {
        ProfilePhoto:GetProfilePhoto1,
        FullName:GetFullName1 
    }
    // Friend2 object 
    let Friend2 = {
        ProfilePhoto:GetProfilePhoto2,
        FullName:GetFullName2
    }
    res.status(200).send({status:true,Friend1:Friend1,Friend2:Friend2})
}
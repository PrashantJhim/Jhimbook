const Mongoose = require('mongoose')
const Secure = require('bcryptjs')
var cookie = require('cookie');
const jwt = require('jsonwebtoken')
export default async (req,res) =>{
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    const Database = await DataList.find({Email:req.body.Email})
    const Data = Database[0]
    const NewSecure = await Secure.hash(req.body.Password,12)
    try{
        const Result = await DataList.updateOne({Email:req.body.Email},{$set:{Password:NewSecure,ProfilePhoto:req.body.ProfilePhoto,FullName:req.body.FullName}})
        let UnSecure = new DataList({
            FullName:req.body.FullName,
            Email: req.body.Email,
            Password : req.body.Password
        })
        const token = await UnSecure.LoginAuthToken()
        res.setHeader('Set-Cookie', cookie.serialize('jwt', String(token), {
      httpOnly: true
    }));
        res.status(200).send({status:true})
    }
    catch{
        res.status(400).send({status:false})
    }
}
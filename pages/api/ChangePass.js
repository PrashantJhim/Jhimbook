const Mongoose = require('mongoose')
const Secure = require('bcryptjs')
const Cookies = require('cookies')
const jwt = require('jsonwebtoken')
export default async (req,res) =>{
    const cookies = new Cookies(req,res)
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    const Database = await DataList.find({Email:req.body.Email})
    const Data = Database[0]
    const NewSecure = await Secure.hash(req.body.Password,12)
    try{
        const Result = await DataList.updateOne({Email:req.body.Email},{$set:{Password:NewSecure}})
        let UnSecure = new DataList({
            FullName:Data.FullName,
            Email: req.body.Email,
            Password : req.body.Password
        })
        const token = await UnSecure.LoginAuthToken()
        cookies.set('jwt',token)
        res.status(200).send({status:true})
    }
    catch{
        res.status(400).send({status:false})
    }
}
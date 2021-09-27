require('../database/connection')
const ImgSch = require('../database/ImgSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Images = Mongoose.models.Img || Mongoose.model('Img',ImgSch); 
    const Delete = await Images.deleteOne({_id:req.body.id})
    console.log(req.body.id)
    const GetAll = await Images.find()
    const Reverse = GetAll.reverse()
    res.status(200).send({status:true})
}
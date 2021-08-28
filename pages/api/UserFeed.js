require('../database/connection')
const ImgSch = require('../database/ImgSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Images = Mongoose.models.Img || Mongoose.model('Img',ImgSch); 
    const GetAll = await Images.find({Email:req.body.Email})
    console.log(req.body.Email)
    const Reverse = GetAll.reverse()
    res.status(200).send({Arr:Reverse})
}
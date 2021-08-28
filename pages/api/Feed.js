require('../database/connection')
const ImgSch = require('../database/ImgSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Images = Mongoose.models.Img || Mongoose.model('Img',ImgSch); 
    const GetAll = await Images.find()
    const Reverse = GetAll.reverse()
    res.status(200).send({Arr:Reverse})
}
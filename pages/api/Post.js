require('../database/connection')
const ImgSch = require('../database/ImgSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Images = Mongoose.models.Img || Mongoose.model('Img',ImgSch); 
    const GetAll = await Images.find({_id:req.body.id})
    if (GetAll.length != 0){
        const Details = GetAll[0] 
        res.status(200).send(Details)
    }
    else{
        res.status(200).send({})
    }
    
    
    
}
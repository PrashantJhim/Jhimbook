require('../database/connection')
const ImgSch = require('../database/ImgSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Images = Mongoose.models.Img || Mongoose.model('Img',ImgSch);
    const Likes = await Images.find({_id:req.body.id}) 
    const ArrOfLikes = Likes[0]['Liked']
    const Index = ArrOfLikes.indexOf(req.body.Email) 
    if (Index != -1){
        res.status(200).send({status:true})
    }
    if (Index == -1){
        res.status(200).send({status:false})
    }
    
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('../database/connection')
const ImgSch = require('../database/ImgSch')
const Mongoose = require('mongoose')

export default async(request,response)=>{
    const Images = Mongoose.models.Img || Mongoose.model('Img',ImgSch);

    const Img = new Images({
        Type:request.body.Type,
        Email:request.body.Email,
        FullName:request.body.FullName,
        Image:request.body.Image,
        Likes:request.body.Likes,
        Tag:request.body.Tag,
        Desc:request.body.Desc
    })
    try{
        const Data = await Img.save()
        response.status(200).send({status:true})
    }catch{
        response.status(404).send({status:false})
    }
}
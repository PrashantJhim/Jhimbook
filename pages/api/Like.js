require('../database/connection')
const ImgSch = require('../database/ImgSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Images = Mongoose.models.Img || Mongoose.model('Img',ImgSch);
    const Likes = await Images.find({_id:req.body.id}) 
    const NoOfLikes = Likes[0]['Likes'] 
    const ArrOfLikes = Likes[0]['Liked']
    const DetailsLike = Likes[0]['PeopleLiked'] 
    const IdOfUser = req.body.Email  
    const Index = ArrOfLikes.indexOf(IdOfUser) 
    if (Index == -1){
        const UpdateNoOfLikes = NoOfLikes + 1 
        const UpdateArrOfLikes = [...ArrOfLikes,req.body.Email] 
        const DetailsForDelete = {index:DetailsLike.length, Details:req.body.Details}
        const UpdateDetailsLike = [...DetailsLike,DetailsForDelete]
        const UpdatedDetails = {
            Likes:UpdateNoOfLikes ,
            Liked:UpdateArrOfLikes,
            PeopleLiked:UpdateDetailsLike 
        }
        const UpdateInDatabase = await Images.updateOne({_id:req.body.id},{$set:UpdatedDetails})
        res.status(200).send({status:true})
    }
    if (Index != -1){
        const UpdateNoOfLikes = NoOfLikes - 1 
        const Index = ArrOfLikes.indexOf(req.body.Email)
        ArrOfLikes[Index] = undefined
        const UpdateArrOfLikes = [...ArrOfLikes] 
        DetailsLike[Index] = undefined
        const UpdateDetailsLike = [...DetailsLike]
        const UpdatedDetails = {
            Likes:UpdateNoOfLikes ,
            Liked:UpdateArrOfLikes,
            PeopleLiked:UpdateDetailsLike 
        }
        const UpdateInDatabase = await Images.updateOne({_id:req.body.id},{$set:UpdatedDetails})
        res.status(200).send({status:false})
    }
}
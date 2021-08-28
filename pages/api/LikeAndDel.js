require('../database/connection')
const CommentSch = require('../database/CommentSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Comments = Mongoose.models.Comments || Mongoose.model('Comments',CommentSch);
    if (req.body.Type == "Like"){
        const FindComment = await Comments.find({_id:req.body.id}) 
        const UpdateLikes = FindComment[0]['Likes'] + 1 
        const UpdateLiked = [...FindComment[0]['Liked'],req.body.Email] 
        const SaveDetails = await Comments.updateOne({_id:req.body.id},{$set:{Likes:UpdateLikes,Liked:UpdateLiked}})
        const NewComments = await Comments.find({Post:req.body.Post})
        res.status(200).send({status:'Liked',Arr:NewComments})
    }
    if (req.body.Type == "Delete"){
        const FindComment = await Comments.deleteOne({_id:req.body.id}) 
        const NewComments = await Comments.find({Post:req.body.Post})
        res.status(200).send({status:'Deleted',Arr:NewComments})    
    }
    if (req.body.Type == 'Unlike'){
        const FindComment = await Comments.find({_id:req.body.id}) 
        const UpdateLikes = FindComment[0]['Likes'] - 1 
        const Arr = FindComment[0]['Liked']
        const Index = Arr.indexOf(req.body.Email) 
        Arr[Index] = undefined
        const UpdateLiked = Arr
        const SaveDetails = await Comments.updateOne({_id:req.body.id},{$set:{Likes:UpdateLikes,Liked:UpdateLiked}})
        const NewComments = await Comments.find({Post:req.body.Post})
        res.status(200).send({status:'Unliked',Arr:NewComments})
    }
}
require('../database/connection')
const CommentSch = require('../database/CommentSch')
const Mongoose = require('mongoose')


export default async (req,res)=>{
    const Comments = Mongoose.models.Comments || Mongoose.model('Comments',CommentSch);
    const Comment = new Comments({
        Email:req.body.Email,
        FullName:req.body.FullName,
        ProfilePhoto:req.body.ProfilePhoto,
        Comment:req.body.Comment,
        Post:req.body.Post,
        Likes:0,
        Liked:[]
    })
   const SaveTheComment = await  Comment.save()
   const NewArr = await Comments.find({Post:req.body.Post})
   res.status(200).send({status:true,Details:Comment,Arr:NewArr})
    
}
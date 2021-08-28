require('../database/connection')
const CommentSch = require('../database/CommentSch')
const Mongoose = require('mongoose')

export default async (req,res) =>{
    const Comments = Mongoose.models.Comments || Mongoose.model('Comments',CommentSch);
    const Arr = await Comments.find({Post:String(req.body.id)})
    res.status(200).send({status:true,Arr:Arr})

}
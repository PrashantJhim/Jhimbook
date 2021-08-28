require('../database/connection')
const Mongoose = require('mongoose')
const MessageSch = require('../database/MessageSch')
export default async(req,res) =>{
    const Message = Mongoose.models.Message || Mongoose.model('Message',MessageSch);
    const Result = await Message.find({_id:req.body.id}) 
   if (Result.length != 0){
    const Messages = Result[0]['Messages'] 
    const NewMessage = [...Messages,{FullName:req.body.FullName,Message:req.body.Message}] 
    const updatedata = await Message.updateOne({_id:req.body.id},{$set:{Messages:NewMessage}})
    res.status(200).send({status:true})
   }
   if (Result.length == 0){
       res.status(200).send({status:false})
   }
    
    
}
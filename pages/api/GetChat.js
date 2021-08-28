require('../database/connection')
const Mongoose = require('mongoose')
const MessageSch = require('../database/MessageSch')
export default async(request,response) =>{
    const Message = Mongoose.models.Message || Mongoose.model('Message',MessageSch);
    const Result = await Message.find({_id:request.body.id})
    response.status(200).send({status:true,Details:Result[0]})
    
}
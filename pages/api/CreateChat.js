require('../database/connection')
const MessageSch = require('../database/MessageSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Message = Mongoose.models.Message || Mongoose.model('Message',MessageSch);
    const Find1 = await Message.find({Friend1:req.body.id1,Friend2:req.body.id2})
    const Find2 = await Message.find({Friend1:req.body.id2,Friend2:req.body.id1}) 
    if (Find1.length == 0 && Find2.length == 0){
        const MessToSave = new Message({
            Messages:[],
            Online1:false,
            Online2:false,
            Friend1:req.body.id1,
            Info1:req.body.info1,
            Info2:req.body.info2,
            Friend2:req.body.id2
        })
        const Save = await MessToSave.save() 
        const Find =  await Message.find({Friend1:req.body.id1,Friend2:req.body.id2}) 
        const Id = Find[0]['_id'] 
        res.status(200).send({status:true,id:Id})
    }
    if (Find1.length != 0 && Find2.length == 0){
        const Found = await Message.find({Friend1:req.body.id1,Friend2:req.body.id2})
        const Id = Found[0]['_id']
        res.status(200).send({status:true,id:Id})
    }
    if (Find1.length == 0 && Find2.length != 0){
        const Found = await Message.find({Friend2:req.body.id1,Friend1:req.body.id2})
        const Id = Found[0]['_id']
        res.status(200).send({status:true,id:Id})
    }

    
}
require('../database/connection')
const NotifSch = require('../database/NotifSch')
const Mongoose = require('mongoose')

export default async(req,res) =>{
    const Notification = Mongoose.models.Notification || Mongoose.model('Notification',NotifSch);
    const Details = new Notification({
        Post:req.body.Post,
        EmailOfRealPost:req.body.EmailOfRealPost,
        TypeOfNot:req.body.Type,
        Src:req.body.Src,
        FullName:req.body.FullName,
        Email:req.body.Email,
        Message:req.body.Message
    })
    const SaveIt = await Details.save() 
    res.status(200).send({status:true})
}
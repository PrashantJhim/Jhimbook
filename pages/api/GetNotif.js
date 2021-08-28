require('../database/connection')
const NotifSch = require('../database/NotifSch')
const Mongoose = require('mongoose')

export default async(req,res) =>{
    const Notification = Mongoose.models.Notification || Mongoose.model('Notification',NotifSch);
    const ArrOfNotif = await Notification.find({EmailOfRealPost:req.body.Email}) 
    const Reverse = ArrOfNotif.reverse()
    res.status(200).send({status:true,Arr:Reverse})
}
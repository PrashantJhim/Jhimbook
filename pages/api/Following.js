require('../database/connection')
const FollowSch = require('../database/FollowSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Follow = Mongoose.models.Follow || Mongoose.model('Follow',FollowSch);
    const ArrOfFollowers = await Follow.find({by:req.body.Email}) 
    res.status(200).send({status:true,Following:ArrOfFollowers})

    
}
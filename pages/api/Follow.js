require('../database/connection')
const FollowSch = require('../database/FollowSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Follow = Mongoose.models.Follow || Mongoose.model('Follow',FollowSch);
    const ArrOfFollow = await Follow.find({Follow:req.body.Follow,by:req.body.by})
    if (ArrOfFollow.length == 0){
        const Details = new Follow({
            Follow:req.body.Follow,
            FollowDetails:req.body.FollowDetails,
            by:req.body.by,
            FullDetails:req.body.FullDetails
        })
        const SaveTheFollow = await Details.save() 
        res.status(200).send({status:true})
    }
    if (ArrOfFollow.length != 0){
        const Delete = await Follow.deleteOne({Follow:req.body.Follow,by:req.body.by})
        res.status(200).send({status:false})
    }

    
}
require('../database/connection')
const FollowSch = require('../database/FollowSch')
const Mongoose = require('mongoose')

export default async(req,res)=>{
    const Follow = Mongoose.models.Follow || Mongoose.model('Follow',FollowSch);
    const Find = await Follow.find({...req.body}) 
    if (Find.length == 0){
        res.status(200).send({status:false})
    }
    if (Find.length != 0){
        res.status(200).send({status:true})
    }

    
}
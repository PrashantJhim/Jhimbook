// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('../database/connection')

const Schema = require('../database/Schema')
const Mongoose = require('mongoose')


export default async (req, res) => {
  var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    
    const Result = await DataList.find({_id:req.body.id})
    if (Result.length != 0){
        const ArrofMessages = Result[0]['MessagesDetails']
        res.status(200).send({status:true,Arr:ArrofMessages})
    }
    if (Result.length == 0){
        res.status(200).send({status:false})
    }
   

  }

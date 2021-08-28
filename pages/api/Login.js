// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('../database/connection')
const Secure = require('bcryptjs')
const Schema = require('../database/Schema')
const Mongoose = require('mongoose')
const Cookies = require('cookies')
const jwt = require('jsonwebtoken')
var cookie = require('cookie');

export default async (req, res) => {
  var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    
    const Result = await DataList.find({Email:req.body.Email})
    if(Result.length != 0){
      const Data = Result[0] 
    var Compare = await Secure.compare(req.body.Password,Data.Password)
    let UnSecure = new DataList({
        FullName:Data.FullName,
        Email: req.body.Email,
        Password : req.body.Password
    })
    const token = await UnSecure.LoginAuthToken()
    res.setHeader('Set-Cookie', cookie.serialize('jwt', String(token), {
      httpOnly: true
    }));
    if (Compare == true){
        res.status(200).send({status:true,FullName:Data.FullName})
    }
    if (Compare == false){
        res.status(200).send({status:false})
    }
    }
    if (Result.length == 0){
      res.status(200).send({status:false})
    }
   

  }

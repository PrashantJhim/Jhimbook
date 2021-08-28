// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

require('../database/connection')
const Secure = require('bcryptjs')
const Schema = require('../database/Schema')
const Mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
var cookie = require('cookie');
export default async (req, res) => {
  
    // Database
  var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
  
    // For token 
  var UnSecure = new DataList({
      FullName : req.body.FullName,
      Email:req.body.Email,
      Password:req.body.Password
  })
  const token = await UnSecure.LoginAuthToken()
  res.setHeader('Set-Cookie', cookie.serialize('jwt', String(token), {
    httpOnly: true
  }));
  // for Saving Into DataBase 
  const NewSecurePass = await Secure.hash(req.body.Password,12)
  let SecureData = new DataList({
    Online:false,
    ProfilePhoto:req.body.ProfilePhoto,
    FullName:req.body.FullName,
    UserName: req.body.UserName,
    Email : req.body.Email ,
    Password: NewSecurePass,
    Followers:0,
    Following:0
})
  try{
      const Result = await SecureData.save()
      res.status(200).send({status:true})
  }
  catch{
      res.status(400).send({status:false})
  }
  
  }

require('../database/connection')
const Schema = require('../database/Schema')
const Mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Cookies = require('cookies')
var cookie = require('cookie');
export default async(request,response) =>{ 
   const token = request.headers.cookie
   if (token == undefined){
    response.status(200).send({Email:undefined,Password:undefined})
}
if (token != undefined){
    var cookies = cookie.parse(token);
    const data = jwt.verify(cookies.jwt,'token')
    // Let Check It Exist in DataBase Or Not 
    var DataList  = Mongoose.models.data|| Mongoose.model('data',Schema);
    const Check = await DataList.find({Email:data.Email})
    if (Check.length != 0){
    response.status(200).send(data)
    }
    if (Check.length == 0){
        response.status(200).send({Email:undefined,Password:undefined})
    }
}
}
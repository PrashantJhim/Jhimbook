const Mongoose = require('mongoose') 

const NotificationSch = new Mongoose.Schema({
   Post:{
       type:String,
       required:true
   },
   TypeOfNot:{
       type:String,
       required:true
   },
   FullName:{
       type:String,
       required:true
   },
   EmailOfRealPost:{
    type:String,
    required:true
   },
   Src:{
       type:String,
       required:true
   },
   Email:{
       type:String,
       required:true
   },
   Message:{
       type:String,
       required:true
   }
})
module.exports = NotificationSch
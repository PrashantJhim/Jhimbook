const Mongoose = require('mongoose') 

const CommentSch = new Mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
   Comment:{
       type:String,
       required:true
},
   ProfilePhoto:{
       type:String,
       required:true
   }, 
   FullName:{
       type:String,
       required:true
   },
   Post:{
       type:String,
       required:true
   },
   Likes:{
       type:Number,
       required:true
   },
   Liked:[]
})
module.exports = CommentSch 
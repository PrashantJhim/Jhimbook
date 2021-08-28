const Mongoose = require('mongoose') 
// jwt is Required To Generate Token(Cookie)
const jwt = require('jsonwebtoken')
// Schema Will Provide Skeleton For Uploading Data on Database 

let Schema = new Mongoose.Schema({
   Follow:{
       type:String,
       required:true
   },
   FollowDetails:{
       type:Object,
       required:true
   },
   by:{
       type:String,
       required:true
   },
   FullDetails:{
       type:Object,
       required:true
   }
})

module.exports = Schema

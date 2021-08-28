const Mongoose = require('mongoose') 
// Schema Will Provide Skeleton For Uploading Data on Database 

let Schema = new Mongoose.Schema({
   Messages:[{
       type:Object
   }],
   Friend1:{
       type:String
   },
   Info1:{
       type:Object
   },
   Info2:{
       type:Object
   },
   Friend2:{
       type:String
   }
})

module.exports = Schema

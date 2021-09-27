const Mongoose = require('mongoose') 
// jwt is Required To Generate Token(Cookie)
const jwt = require('jsonwebtoken')
// Schema Will Provide Skeleton For Uploading Data on Database 

let Schema = new Mongoose.Schema({
    Online:{type:Boolean},
    ProfilePhoto: {
        type:String
    },
    FullName:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        required:true
    },
    Messages:{
        type:String
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Saved:[],
    MessageEmail:[{type:String}],
    MessagesDetails:[{type:Object}],
    Images:[
        {
            type:Object
        }
    ],
    Followers:{type:Number},
    Following:{type:Number},
    PeopleFollowUser:[{type:Object}],
    Followed:[{type:Object}],
    Liked:[
        {
            type:String
        }
    ],
    messages:[{type:Object}]
})
Schema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({FullName:String(this.FullName),Email:String(this.Email),Password:String(this.Password)},'token')
        return token
        
    }catch{
        console.log('not working')
    }
}
Schema.methods.LoginAuthToken = async function(){
    
        const token = await jwt.sign({FullName:String(this.FullName),Email:String(this.Email),Password:String(this.Password)},'token')
        return token
        
    
}
module.exports = Schema

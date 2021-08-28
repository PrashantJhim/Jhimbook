const Mongoose = require('mongoose') 

const ImgSch = new Mongoose.Schema({
    Type:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    FullName:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        required:true 
    },
    Tag:{
        type:String
    },
    Likes:{
        type:Number
    },
    PersonSaved:[],
    Liked:[{
        type:String
    }],
    PeopleLiked:[{type:Object}],
    Desc:{
        type:String
    },
    Comments:[
        {
            type:Object
        }
    ]
})
module.exports = ImgSch 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"first name of user is required"]
    },
    lastName:{
        type:String,
        required:[true,"last name of user is required"]
    },
    email:{
        type:String,
        required:[true,"email of user is required"]
    },
    password:{
        type:String,
        required:[true,"password of user is required"]  
    },
    blogs:[
        {
            type:mongoose.Types.ObjectId,
            ref:'Blog'
        }
    ]
},{timestamps:true});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
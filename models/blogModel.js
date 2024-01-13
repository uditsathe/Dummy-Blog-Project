const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    },
    content:{
        type:String,
        required:[true,'content is required']
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'User ID of author is required']
    }
},{timestamps:true});

const blogModel = mongoose.model("Blog", blogSchema)

module.exports = blogModel;
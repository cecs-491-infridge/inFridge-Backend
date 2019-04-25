const mongoose = require('mongoose');

let ChatSchema = new mongoose.Schema({
    user1:{
        type: String,
        required:true
    },
    user2:{
        type:String,
        required:true
    },
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }],
});


module.exports = mongoose.model('Chat', ChatSchema);

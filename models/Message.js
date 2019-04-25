const mongoose = require('mongoose');

let MsgSchema = new mongoose.Schema({
    from:{
        type: String,
        required:true
    },
    to:{
        type: String,
        required:true
    },
    msg:{
        type:String,
        required:true
    },
    time: {
        type: Date,
        required:true
    }
});

module.exports = mongoose.model('Message', MsgSchema);

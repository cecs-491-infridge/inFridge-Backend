const mongoose = require('mongoose');

let MsgSchema = new mongoose.Schema(
    {
        //timestamp
        //sender
        //users array
        //body
        //
    }
)

module.exports = mongoose.model('Message', MsgSchema);

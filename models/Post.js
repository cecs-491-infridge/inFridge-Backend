const mongoose = require('mongoose');

let PostSchema = new mongoose.Schema(
    {
        id: String,
        creationDate: Number,
        location: String,
        isActive: Boolean,
        tradeType: String
    }
)

module.exports = mongoose.model('Post', PostSchema);
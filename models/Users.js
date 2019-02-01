const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        password: String,
        rating: Number,
        postHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
    }
)

module.exports = mongoose.model('User', UserSchema);
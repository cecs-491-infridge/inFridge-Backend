const mongoose = require('mongoose');

let PostSchema = new mongoose.Schema(
    {
        location: String,
        isActive: Boolean,
        tradeType: {
            type: String,
            // Allowable values for tradeType
            enum: ['donate', 'trade', 'sell']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    // Adds createdAt and updatedAt fields (automatically updates)
    { timestamps: true }
)

module.exports = mongoose.model('Post', PostSchema);
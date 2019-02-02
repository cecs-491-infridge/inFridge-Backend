const mongoose = require('mongoose');

let TransactionSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        completionDate: { type: Date, default: 0 }
    }
)

module.exports = mongoose.model('Transaction', TransactionSchema);
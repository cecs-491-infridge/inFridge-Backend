const mongoose = require("mongoose");

let TransactionSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.Object.Id,
            ref: 'Post'
        },
        id: String,
        completionDate: Number,
        receivingUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        givingUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            maxLength: 20,
            minLength: 1
        },
        password: { type: String, required: true },
        rating: { type: Number, default: 0 },
        foodList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserFood'
            }
        ],
        // fridge:
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Fridge'
        //     },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
    },
    // Adds only createdAt field
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// For when searching by username
// Searches by name, returns all with name
UserSchema.index({ name: 1 });

module.exports = mongoose.model('User', UserSchema);
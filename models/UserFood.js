const mongoose = require('mongoose');

let UserFoodSchema = new mongoose.Schema(
    {
        expirationDate: Date,
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }
    }
)

module.exports = mongoose.model('UserFood', UserFoodSchema);
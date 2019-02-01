const mongoose = require('mongoose');

let UserFoodSchema = new mongoose.Schema(
    {
        id: Number,
        expirationDate: Date
    }
)

module.exports = mongoose.model('UserFood', UserFoodSchema);
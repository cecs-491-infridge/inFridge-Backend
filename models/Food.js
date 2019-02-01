const mongoose = require('mongoose');

let FoodSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        calories: Number,
        foodGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodGroup'
        }
    }
)

module.exports = mongoose.model('Food', FoodSchema);
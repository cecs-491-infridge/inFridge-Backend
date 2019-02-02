const mongoose = require('mongoose');

let FoodSchema = new mongoose.Schema(
    {
        name: String,
        calories: Number,
        foodGroup: {
            type: String,
            // Allowable values for foodGroup
            enum: ['grain, meat']
        }
    }
)

module.exports = mongoose.model('Food', FoodSchema);
const mongoose = require('mongoose');

let FoodGroupSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
    }
)

module.exports = mongoose.model('FoodGroup', FoodGroupSchema);
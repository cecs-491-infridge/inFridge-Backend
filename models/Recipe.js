const mongoose = require('mongoose');

let RecipeSchema = new mongoose.Schema(
    {
        name: String,
        calories: Number,
        ingredients: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }
    }
)

module.exports = mongoose.model('Recipe', RecipeSchema);
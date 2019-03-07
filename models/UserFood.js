const mongoose = require('mongoose');

let UserFoodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 20,
            minLength: 1
        },
        calories: Number,
        foodGroup: {
            type: String,
            // Allowable values for foodGroup
            enum: ['grain, meat']
        },
        // fridgeId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Fridge'
        // },
        expirationDate: Date
    }
)

module.exports = mongoose.model('UserFood', UserFoodSchema);
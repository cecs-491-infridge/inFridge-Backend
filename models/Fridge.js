const mongoose = require('mongoose');

let FridgeSchema = new mongoose.Schema(
    {
        ingredients: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserFood'
        },
        public: Boolean
    }
)

module.exports = mongoose.model('Fridge', FridgeSchema);
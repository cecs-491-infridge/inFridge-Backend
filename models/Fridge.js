const mongoose = require('mongoose');

let FridgeSchema = new mongoose.Schema(
    {
        foodList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserFood'
            }
        ],
        public: Boolean
    },
    { timestamps: true }
)

module.exports = mongoose.model('Fridge', FridgeSchema);
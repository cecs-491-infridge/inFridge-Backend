const mongoose = require('mongoose');
const User = require('./User');

let FridgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            maxLength: 20,
            minLength: 1    
        },
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

FridgeSchema.pre('save', async function(next) {
    const query = { _id: owner };
    const update = { $push: { fridges: this._id } }
    const data = await User.updateOne(
        query,
        update
    );

    // Call next middleware
    next();
});

module.exports = mongoose.model('Fridge', FridgeSchema);
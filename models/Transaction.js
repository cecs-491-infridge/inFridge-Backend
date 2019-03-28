const mongoose = require('mongoose');
const { Post, discriminatorKey } = require('./Post');

let TransactionSchema = new mongoose.Schema(
    {
        tradeType: {
            type: String,
            // Allowable values for tradeType
            enum: ['donate', 'trade', 'sell'],
            required: true
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Comment'
            }
        ],
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        completionDate: { type: Date, default: null }
    },
    discriminatorKey
);

// Returns
// undefined on success and
// err on error
TransactionSchema.statics.complete = async function(transactionId, buyerId) {
    const query = { _id: transactionId }
        , update = {
            $set: {
                buyer: buyerId,
                completionDate: Date.now()
            }
        }

        try{
            const status = await this.updateOne(
                query,
                update
            );
            console.log(status);
        }catch(err) {
            console.log(err);
            return err;
        }
}

module.exports = Post.discriminator('Transaction', TransactionSchema);

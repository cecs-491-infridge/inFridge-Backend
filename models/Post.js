const mongoose = require('mongoose');

// Base Schema
// is inheritted by Transaction
// and any other Post variations

const discriminatorKey = { discriminatorKey: 'kind' };
const options = {
    ...discriminatorKey,
    // Adds createdAt and updatedAt fields (automatically updates)
    timestamps: true
}

let PostSchema = new mongoose.Schema(
    {
        // author: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        //     required: true
        // },
        body: { type: String, required: true, minlength: 1 },
        likes: {
            type: Number,
            default: 0
        }
    },
    options
)

// PostSchema.pre('save', function(next) {
//     console.log('Post');
//     console.log(options);
//     next();
//   });

// Returns
// undefined on success and
// err on error
PostSchema.statics.likePost = async function(postId) {
    const query = { _id: postId }
        , update = { $inc: { likes: 1 } };

    try{
        await this.updateOne(
            query,
            update
        );
    }catch(err) {
        return err;
    }
}

module.exports = {
    Post: mongoose.model('Post', PostSchema),
    discriminatorKey
};
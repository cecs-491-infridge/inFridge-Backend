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

const locationSchema = require('./Location.js').Schema;

let PostSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        body: { type: String, required: true, minlength: 1 },
        imageUrl: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Comment'
            }
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
	    location: locationSchema
    },
    options
)

/*
PostSchema.pre('save', function(next) {
	console.log('Post');
	console.log(options);
	next();
});
*/

// Returns
// undefined on success and
// err on error
PostSchema.statics.likePost = async function(userId, postId) {
    const query = { _id: postId };
    let update;

    console.log('in')
    
    try {
        let post = await this.findById(postId);
        console.log(post)
        // Dislike
        if(post.likes.some(id => id.equals(userId))) {
            console.log(1)
            update = { $pull: { likes: userId } };
        } 
        // Like
        else{
            console.log(2)
            update = { $push: { likes: userId } };
        } 

        result = await this.updateOne(
            query,
            update
        );

        return result;
    }catch(err) {
        console.log(err)

        return err;
    }
}
PostSchema.methods.getLikes = () => this.likes.length;

PostSchema.index({ author: 1 });

module.exports = {
    Post: mongoose.model('Post', PostSchema),
    discriminatorKey
};

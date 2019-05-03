const mongoose = require('mongoose');
const { Post, discriminatorKey } = require('./Post');
const idConstructor = require('mongoose').Types.ObjectId;

let CommentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        }
    },
    discriminatorKey
);

CommentSchema.pre('save', function(next) {
	this._id = idConstructor();
	next();
});

module.exports = Post.discriminator('Comment', CommentSchema);

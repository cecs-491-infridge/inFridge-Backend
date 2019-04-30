const mongoose = require('mongoose');
const { Post, discriminatorKey } = require('./Post');
const idConstructor = require('mongoose').Types.ObjectId;

let CommentSchema = new mongoose.Schema(
    {},
    discriminatorKey
);

CommentSchema.pre('save', function(next) {
	this._id = idConstructor();
	next();
});

module.exports = Post.discriminator('Comment', CommentSchema);

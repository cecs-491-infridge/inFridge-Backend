const mongoose = require('mongoose');
const { Post, discriminatorKey } = require('./Post');

let CommentSchema = new mongoose.Schema(
    {},
    discriminatorKey
);

module.exports = Post.discriminator('Comment', CommentSchema);

const util = require('../utility/responses');
const User = require('../models/User');
const { Post } = require('../models/Post');
const Transaction = require('../models/Transaction');
const Comment = require('../models/Comment');

module.exports = {
        getUserPost: (req, res) => {
            const { postId } = req.params;
        
            util.respondWithDataById(res, Post, postId);
        },

        getAllUserPosts: (req, res) => {
            const userId = req.params.userId;

            util.populateAndRespond(res, User, userId, 'posts');
        },

        getAllPosts: async (req, res) => {
            try {
                console.log('getAllPosts')
                const allPosts = await Post.find({ $or: [ {kind: 'Transaction'}, {kind: 'Post'} ]}).populate('comments');

                console.log('success');

		        console.log(allPosts);

                res.status(201).send({
                    data: allPosts
                });
            }catch(err) {
                console.log('error')

                res.status(404).send({
                    response: err.name,
                    message: err.message
                });
            }
        },

        // Need to test
        deletePost: async(req, res) => {
            console.log('in')
            try{
                const { postId, inputPassword } = req.body;

                const userId = await Post.findById(postId).select('author');
                console.log(userId);

                const password = await User.findById(userId).select('password');
                console.log(password);

                // Decrypt password
                // if(inputPassword === password) {
                    const remove = await Post.findByIdAndRemove(postId);
                    res.status(201).send(remove);
                // }else throw new Error('Invalid credentials');

            }catch(err) {
                res.status(409).send(err);
            }
        },

        likePost: async(req, res) => {
            const userId = req.user._id;
            const { postId } = req.body;

            try {
                const response = await Post.likePost(userId, postId);

                res.status(200).send(response);

            }catch(err) {
                res.status(400).send(err);
            }
        },

        // TRANSACTIONS
        createTransaction: async(req, res) => {
            try {
                // Grab userId, provided by login middleware
                const userId = req.user._id;
                const username = req.user.name;
                // Grab Transaction and image data from req
                // Added by multer and aws middleware
                const transactionId = req.ids[0];
                const imageUrl = req.awsUrls[0];

                const { body, longitude, latitude, tradeType } = req.body;

                console.log(req.body);

                if(!imageUrl && !body || !longitude && !latitude) return res.status(400).send("Please include at least an Image OR Desciption AND please set your location");
            
                const transaction = new Transaction({
                    _id: transactionId,
                    authorId: userId,
                    authorName: username,
                    body,
                    location:{longitude,latitude},
                    tradeType,
                    imageUrl
                });

                // Save Transaction
                const save = await transaction.save();
                
                // Save to User
                const query = { _id: userId };
                const update = { $push: { posts: transaction._id } }
                await User.updateOne(    
                    query,
                    update
                );

                // Success!
                res.status(201).send({
                    data: save,
                });
            }catch(err) {
		    console.log(err);
                res.status(409).send(err);
            }
        },
        createStatusPost: async(req, res) => {
            try {
                // Grab userId, provided by login middleware
                const userId = req.user._id;
                const username = req.user.name;
                // Grab Transaction and image data from req
                // Added by multer and aws middleware
                const postId = req.ids[0];
                const imageUrl = req.awsUrls[0];

                const { body } = req.body;

                console.log(req.body);

                if(!imageUrl && !body) return res.status(400).send("Please include at least an Image OR Desciption");
            
                const post = new Post({
                    _id: postId,
                    authorId: userId,
                    authorName: username,
                    body,
                    imageUrl
                });

                // Save Post
                const save = await post.save();
                
                // Save to User
                const query = { _id: userId };
                const update = { $push: { posts: post._id } }
                await User.updateOne(    
                    query,
                    update
                );

                // Success!
                res.status(201).send({
                    data: save,
                });
            }catch(err) {
		    console.log(err);
                res.status(409).send(err);
            }
        },

        completeTransaction: async(req, res) => {
            try{
                const { transactionId, buyer } = req.body;

                const transactionQuery = { _id: transactionId };
                const transactionUpdate = { buyer: buyer };
                const userQuery = { _id: buyer };
                const userUpdate = { $push: { posts: transactionId } };

                const transactionData = await Transaction.updateOne(
                    transactionQuery,
                    transactionUpdate
                );

                const userData = await User.updateOne(
                    userQuery,
                    userUpdate
                );

                res.status(201).send(
                    {
                        data: {
                            ...transactionData,
                            ...userData
                        }
                    }
                )
            }catch(err) {
                res.status(409).send(err);
            }
        },

        createComment: async(req, res) => {
            try{
                const userId = req.user._id;
                const username = req.user.name;

                const { postId, body } = req.body;
                const comment = new Comment({
                    postId,
                    authorId: userId,
                    authorName: username,
                    body
                });

                // Save comment
                const save = await comment.save();

                // Save to Post
                const query = { _id: postId };
                const update = { $push: { comments: comment._id } };

                await Post.updateOne(
                    query,
                    update
                );

                res.status(201).send({
                    data: save
                });
                
            }catch(err){
                console.log(err);
                res.status(409).send(err);
            }
        }
}

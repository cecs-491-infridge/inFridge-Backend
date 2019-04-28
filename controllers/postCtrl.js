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
                const allPosts = await Post.find({});

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
            try{
                const { postId, userId } = req.body;

                const query = { _id: postId };
                const update = { $push: { likes: userId } };

                const data = await Post.updateOne(
                    query,
                    update
                );

                res.status(201).send(
                    data
                )
            }catch(err){
                res.status(409).send(err);
            }
        },
        unlikePost: async(req, res) => {
            try{
                const { postId, userId } = req.body;

                const query = { _id: postId };
                const update = { $pull: { likes: userId } };

                const data = await Post.updateOne(
                    query,
                    update
                );

                res.status(201).send(
                    data
                )
            }catch(err){
                res.status(409).send(err);
            }
        },

        // TRANSACTIONS
        createTransaction: async(req, res) => {
            // console.log(req.body);
            
            // FOR FUTURE AUTHENTICATION
            // const password = decrypt(User.password)
            // if(req.password === password)
            // Do below----
            // Else res.status(403).send('Forbidden: Incorrect password');

            
            try {
                // Grab userId, provided by login middleware
                const userId = req.user._id;
                // Grab Transaction and image data from req
                // Added by multer and aws middleware
                const transactionId = req.ids;
                const imageUrl = req.awsUrls;

                const { body, longitude, latitude, tradeType } = req.body;

                if(!imageUrl && !body || !longitude && !latitude) return res.status(400).send("Please include an Image OR Desciption AND please set your location");
            
                const transaction = new Transaction({
                    _id: transactionId,
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
                const { author, postId, body } = req.body;
                const comment = new Comment({
                    author,
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
                res.status(409).send(err);
            }
        }
}

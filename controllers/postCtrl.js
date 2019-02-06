const util = require('../utility/responses');
const User = require('../models/User');
const Post = require('../models/Post');
const Transaction = require('../models/Transaction');

module.exports = {
        getUserPost: (req, res) => {
            const { postId } = req.params;
        
            util.respondWithDataById(res, Post, postId);
        },

        getAllUserPosts: (req, res) => {
            const userId = req.params.userId;
        
            util.populateAndRespond(res, User, userId, 'posts');
        },

        // TRANSACTIONS
        createTransaction: async(req, res) => {
            // console.log(req.body);
            
            // FOR FUTURE AUTHENTICATION
            // const password = decrypt(User.password)
            // if(req.password === password)
            // Do below----
            // Else res.status(403).send('Forbidden: Incorrect password');

    
            const userId = req.params.userId;
            const { body, location, tradeType } = req.body;
        
            const transaction = new Transaction({
                // author: userId,
                body,
                location,
                tradeType
            });

            try {
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
                res.sendStatus(409);
            }
        
            // util.saveDocAndRespond(res, transaction);
        }
}
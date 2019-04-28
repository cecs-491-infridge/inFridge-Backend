const util = require('../utility/responses');
const User = require('../models/User');

const { authenticateUser } = require('../MicrosoftGraph/microsoftGraph');

module.exports = {
    requestFriend: async(req, res) =>  {
	try {
	    // Change this to use JWT
            const { requestorId, userId } = req.body.requestorId;

            // Add to User to Pending Friends list
            const query = { _id: userId };
            const update = { $push: { pendingFriends: requestorId } };
            const pushToPendingFriends = await User.updateOne(
                query,
                update
            );

	    res.status(200).send({
		data: pushToPendingFriends
	    });

	}catch(err) {
	    console.log(err);
	}
    },
    handleFriendRequest: async (req, res) => {
	    const { userId, requestorId, accept } = req.body;

        const queryUser = { _id: userId };
        const queryRequestor = { _id: requestorId };
        const pullFromUser = { $pull: { pendingFriends: requestorId } };
        let update;

        if(accept) {
            // Remove requestor from pending list
            // Add friend to User
            update = {
                ...pullFromUser,
                $push: { friendsList: requestorId }
            };
            const pushToUserFriendsList = await User.updateOne(
                queryUser,
                update
            );

            // Add user to Requestor friends list
            const pushToRequestorFriendsList = await User.updateOne(
              queryRequestor,
              { $push: { friendsList: userId } }
            );    
            
            res.status(200).send({
              data: {
                ...pushToUserFriendsList,
                ...pushToRequestorFriendsList
              }
            });
        }else {
            // Remove requestor from pending list
            const pullFromUserFriendsList = await User.updateOne(
              queryUser,
              pullFromUser
            );

            res.status(200).send({
              data: pullFromUserFriendsList
            })
        }
    },
    // Probably get id from login service
    createUser: async(req, res) => {
        try{
            const { username, password } = req.body;


            // Encrypt password maybe?
            //The key is stored:
            //1. the user's phone
            //2. the db
            //????????????Which one is encrypted

//2 attacks:
//1. when the user sends to the server the key and other stuff
//2. on the db to get all the user data
//
            let user = await User.find({ name:username });
            if(user.length) return res.status(403).send('Username already exists');

            user = new User({
                name: username,
                password
            });

            //saving user to database
            const newUser = await user.save();

            res.status(201).send({
                message: 'User successfully Saved!',
                data: newUser,
            });
        }catch(err) {
            console.log(err.name+'\n');
            console.log(err.code+'\n');
            console.log(err.message);

            res.status(409).send({
                error: err.name,
                message: err.message
            });
        }
    },

    getUser: async(req, res) => {
        try{
            const id = req.params.id;

            const user = await User.findById(id);
            res.status(200).send({
                data: user
            });
        }catch(err) {
            console.log(err);
            res.status(404).send({
                response: err.name,
                message: err.message
            });
        }
    },

    // Temp method for testing
    getAllUsers: async(req, res) => {
        try{
            const users = await User.find({});
            res.status(201).send({
                data: users
            });
        }catch(err) {
            res.status(404).send({
                response: err.name,
                message: err.message
            });
        }
    }
}

// curl -d '{"name": "Daniel", "password": "123"}' -H "Content-Type: application/json" -X POST http://localhost:3000/create-fridge

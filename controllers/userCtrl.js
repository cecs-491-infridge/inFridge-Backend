const util = require('../utility/responses');
const User = require('../models/User');

const { authenticateUser } = require('../MicrosoftGraph/microsoftGraph');

module.exports = {
    // Probably get id from login service
    createUser: async(req, res) => {
        try{
            const { studentId, studentPassword, userName, userPassword } = req.body;

            // Authenticate student id and password with Graph API
            // Call Auth route at authenticateUser:
            const authKey = authenticateUser(studentId, studentPassword);
            // Not authenticated
            if(!authKey) throw new Error("Not authenticated");

            // Encrypt password maybe?
            //The key is stored:
            //1. the user's phone
            //2. the db
            //????????????Which one is encrypted

//2 attacks:
//1. when the user sends to the server the key and other stuff
//2. on the db to get all the user data


            const user = new User({
                userName,
                userPassword,
                userKey
            });

            //saving user to database
            const newUser = await user.save();

            res.status(201).send({
                message: 'User successfully Saved!',
                data: newUser,
                authKey //if they're called the same thing, no need for colon
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

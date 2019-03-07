const util = require('../utility/responses');
const User = require('../models/User');

module.exports = {
    // Probably get id from login service
    createUser: async(req, res) => {
        try{
            const { name, password } = req.body;

            // Encrypt password
            const user = new User({
                name,
                password
            });
    
            const newUser = await user.save();

            res.status(201).send({
                response: 'User successfully Saved!',
                data: newUser
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

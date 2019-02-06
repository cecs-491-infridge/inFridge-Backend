const util = require('../utility/responses');
const User = require('../models/User');

module.exports = {
    // Probably get id from login service
    createUser: (req, res) => {
        const { name, password } = req.body;

        // Encrypt password
        // encrypt(password)
        const user = new User({
            name,
            password
        });
    
        util.saveDocAndRespond(res, user);
    },
    
    getUser: (req, res) => {
        const id = req.params.id;
        console.log(id);
    
        util.getDocByIdAndRespond(res, User, id);
    }
}
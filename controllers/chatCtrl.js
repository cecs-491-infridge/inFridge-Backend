const socket = require('../utility/chatSocket.js');

module.exports = {

	getChat: async(req, res) => {
        // grab msgs from database and send back
        // TODO
        
        res.status(200);
	},

	sendMsg: async(req, res) => {
        let { from, msg, to } = req.query;

        socket.send(from, msg, to);

        // Save to database
        // TODO

        res.status(200);
	},
}


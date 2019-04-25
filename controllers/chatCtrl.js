const socket = require('../utility/chatSocket.js');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

module.exports = {

	getChat: async(req, res) => {
        let {from, to} = req.query;
        let user1 = from>to?from:to;
        let user2 = from>to?to:from;
        
        // grab msgs from database and send back
        let chat = await Chat.find({user1,user2})
            //.sort({createdAt:'desc'})
            //.skip(page*limit)
            //.limit(limit)
            .populate({
                path:'messages',
                options:{
                    sort:{
                        'time':1
                    }
                }
            });
        
        console.log(chat);
        if(!chat[0])
            res.status(200).send([]);
        else
            res.status(200).send(chat[0].messages);
	},

	sendMsg: async(req, res) => {
        let { from, msg, time, to } = req.body;

        socket.send(from, msg, time, to);

        // Save to database
        let message = new Message({
            from,
            to,
            msg,
            time:new Date(time)
        });
        message = await message.save();

        let user1 = from>to?from:to;
        let user2 = from>to?to:from;

        let result =  await Chat.updateOne(
            {user1,user2},
            {$push: {messages:message._id}}
        );
        console.log(result);

        if(result.nModified<=0){
            let chat = await (new Chat({user1,user2})).save();
            console.log(chat);

            let result =  await Chat.updateOne(
                {user1,user2},
                {$push: {messages:message._id}}
            );
            console.log(result);
        }

        res.send(200);
	},
}


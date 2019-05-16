/* 
 * Handles all the chat requests and redirects it to socketio
 */
const socket = require('../utility/chatSocket.js');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = {

    /* Get all the available chats
     * (debugging route)
     */
    getAllChats: async(req, res) => {
        try {
            let chats = await Chat.find({});
            res.status(200).send(chats);                
        }catch(err) {
            console.error(err);
            res.send(400);
        }
    },

    /*
     * Get all the chat according to the given id
     */
    getChats: async(req, res) => {
        try{
            let {id} = req.query;
            let chats = await Chat.find(
                {$or:[
                    {user1:id},
                    {user2:id}
                ]})
                .populate({
                    path:'messages',
                    options:{
                        sort:{
                            'time':-1
                        },
                        limit:1
                    },
                });

            let result = [];
            for(let i in chats){
                let chat = chats[i];

                let name = (await User.findById(chat.user1)).name;
                if(!name) name = "No name";
                let user1 = {id:chat.user1,name};

                name = (await User.findById(chat.user2)).name;
                if(!name) name = "No name";
                let user2 = {id:chat.user2,name};

                result.push({
                    messages:chat.messages,
                    user1,
                    user2
                });
            }

            res.status(200).send(result);
        }catch(e){
            console.error(e);
            res.send(400);
        }

    },

    /*
     * Get the msgs in a specific chat
     */
	getMsgs: async(req, res) => {
        try{
            let {from, to} = req.query;
            let user1 = from>to?from:to;
            let user2 = from>to?to:from;
            
            // grab msgs from database and send back
            let chat = await Chat.find({user1,user2})
                .populate({
                    path:'messages',
                    options:{
                        sort:{
                            'time':1
                        }
                    }
                });
            
            if(!chat[0])
                res.status(200).send([]);
            else
                res.status(200).send(chat[0].messages);
        }catch(e){
            console.error(e);
            res.send(400);
        }
	},

    /*
     * Saves a message and sends it to socketio
     */
	sendMsg: async(req, res) => {
        try{
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
        }catch(e){
            console.error(e);
            res.send(400);
        }
	},
}


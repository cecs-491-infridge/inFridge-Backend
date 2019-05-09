const chatCtrl = require('../controllers/chatCtrl');

module.exports = (router) => {
    
    router
        .route('/get-all-chats')
        .get(chatCtrl.getAllChats);

    router
        .route('/get-chats')
        .get(chatCtrl.getChats);

    router
        .route('/get-msgs')
        .get(chatCtrl.getMsgs);

    router
        .route('/send-msg')
        .post(chatCtrl.sendMsg);
}

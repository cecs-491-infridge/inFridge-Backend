const chatCtrl = require('../controllers/chatCtrl');

module.exports = (router) => {
    router
        .route('/get-chat')
        .get(chatCtrl.getChat);

    router
        .route('/send-msg')
        .post(chatCtrl.sendMsg);
}

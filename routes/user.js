/*
Module to route api requests to the correct User methods in ../controllers/usertCtrl.js
*/

const userCtrl = require('../controllers/userCtrl');

module.exports = (router) => {
    // Probably get id from login service
    router
        .route('/create-user')
        .post(userCtrl.createUser);

    router
        .route('/user/:id')
        .get(userCtrl.getUser);

    router
        .route('/request-friend')
        .post(userCtrl.requestFriend);

    router
        .route('/handle-friend-request')
        .post(userCtrl.handleFriendRequest);
    router
        .route('/get-all-users')
        .get(userCtrl.getAllUsers);
}

const userCtrl = require('../controllers/userCtrl');

module.exports = (router) => {
    // Probably get id from login service
    router
        .route('/user')
        .post(userCtrl.createUser);

    router
        .route('/user/:id')
        .get(userCtrl.getUser);

    router
        .route('/all-users')
        .get(userCtrl.getAllUsers);
}
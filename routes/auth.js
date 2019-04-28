const authCtrl = require('../controllers/authCtrl');

module.exports = (router) => {
    router
        .route('/login-test')
        .post(authCtrl.loginTest);

    router
        .route('/authenticate-user')
        // .post(authCtrl.authenticateUser, authCtrl.authenticateUserRedirect);
        .post(authCtrl.authenticateUser);

    router
        .route('/verify-username')
        .post(authCtrl.verifyUsername);

    router
        .route('/verify-token')
        .post(authCtrl.verifyToken);
    // router
    //     .route('/callback')
    //     .post(authCtrl.callback, authCtrl.callbackRedirect);

    router
        .route('/login-user')
        .post(authCtrl.loginUser);

    router
        .route('/signout')
        .post(authCtrl.signout);
}

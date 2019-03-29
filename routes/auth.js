const authCtrl = require('../controllers/authCtrl');

module.exports = (router) => {
    router
        .route('/authenticate-user')
        // .post(authCtrl.authenticateUser, authCtrl.authenticateUserRedirect);
        .post(authCtrl.authenticateUser);

    // router
    //     .route('/callback')
    //     .post(authCtrl.callback, authCtrl.callbackRedirect);

    router
        .route('/signin')
        .post(authCtrl.signIn);

    router
        .route('/signout')
        .post(authCtrl.signout);
}

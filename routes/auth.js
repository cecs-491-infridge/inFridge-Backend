const authCtrl = require('../controllers/authCtrl');

module.exports = (router) => {
    router
        .route('/authenticate-user')
        .post(authCtrl.authenticateUser);

    router
        .route('/callback')
        .post(authCtrl.callback);

        
    router
        .route('/sign-in')
        .post(authCtrl.signIn);
}

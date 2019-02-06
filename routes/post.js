const postCtrl = require('../controllers/postCtrl');

module.exports = (router) => {
    router
        .route('/:userId/post/:postId')
        .get(postCtrl.getUserPost);

    router
        .route('/:userId/all-posts')
        .get(postCtrl.getAllUserPosts);

    // TRANSACTIONS
    router
        .route('/:userId/transaction')
        .post(postCtrl.createTransaction);
}
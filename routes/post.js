const postCtrl = require('../controllers/postCtrl');

module.exports = (router) => {
    router
        .route('/:userId/get-post/:postId')
        .get(postCtrl.getUserPost);

    router
        .route('/:userId/all-posts')
        .get(postCtrl.getAllUserPosts);

    router
        .route('/delete-post')
        .post(postCtrl.deletePost);

    router
        .route('/like-post')
        .post(postCtrl.likePost);

    // TRANSACTIONS
    router
        .route('/create-transaction')
        .post(postCtrl.createTransaction);

    router
        .route('/complete-transaction')
        .post(postCtrl.completeTransaction);

    // COMMENTS
    router
        .route('/create-comment')
        .post(postCtrl.createComment);
}
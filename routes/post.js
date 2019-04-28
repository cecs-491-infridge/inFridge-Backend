const postCtrl = require('../controllers/postCtrl');
const { loggedIn, uploadToAws } = require('../utility/customMiddleware');

const maxFileSize = 2;
const maxFields = 3;
const exposeSingleFile = require('../utility/customMiddleware').getMulterSingle(maxFileSize, maxFields);

module.exports = (router) => {
    router
        .route('/:userId/get-post/:postId')
        .get(postCtrl.getUserPost);

    router
        .route('/:userId/all-posts')
        .get(postCtrl.getAllUserPosts);

    // Dev route
    router
        .route('/all-posts')
        .get(postCtrl.getAllPosts);

    router
        .route('/delete-post')
        .delete(postCtrl.deletePost);

    router
        .route('/like-post')
        .post(postCtrl.likePost);
    router
        .route('/unlike-post')
        .post(postCtrl.unlikePost);

    // TRANSACTIONS
    router
        .route('/create-transaction')
        .post(
            // loggedIn,
            exposeSingleFile,
            uploadToAws,
            postCtrl.createTransaction
        );

    router
        .route('/complete-transaction')
        .post(postCtrl.completeTransaction);

    // COMMENTS
    router
        .route('/create-comment')
        .post(postCtrl.createComment);
}
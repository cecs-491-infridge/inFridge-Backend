const postCtrl = require('../controllers/postCtrl');
const { login, loggedIn, uploadToAws } = require('../utility/customMiddleware');

const maxFileSize = 20;
const maxFields = 10;
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

    // TRANSACTIONS
    router
        .route('/create-transaction')
        .post(
            exposeSingleFile,
            login,
            loggedIn,
            uploadToAws,
            postCtrl.createTransaction
        );

    router
        .route('/create-status-post')
        .post(
            exposeSingleFile,
            login,
            loggedIn,
            uploadToAws,
            postCtrl.createStatusPost
        );

    router
        .route('/complete-transaction')
        .post(postCtrl.completeTransaction);

    // COMMENTS
    router
        .route('/create-comment')
        .post(postCtrl.createComment);
}

const apiCtrl = require('../controllers/apiCtrl');

module.exports = (router) => {
    router
        .route('/get-recipe')
        .post(apiCtrl.getRecipe);

}

const apiCtrl = require('../controllers/apiCtrl');

module.exports = (router) => {
    router
        .route('/get-recipe')
        .get(apiCtrl.getRecipe);

    router
        .route('/search-recipe')
        .get(apiCtrl.searchRecipe);


}

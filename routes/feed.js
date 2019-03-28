const feedCtrl = require('../controllers/feedCtrl');

module.exports = (router) => {

    /* Get feed from friends */
    router
        .route('/:id/feed')
        .get(feedCtrl.getUserFeed);

    /* Get feed from nearby location */
    router
        .route('/:id/nearby-feed')
        .get(feedCtrl.getNearbyFeed);

}

/*
Module to route api requests to the correct Fridge methods in ../controllers/fridgeCtrl.js
*/

const fridgeCtrl = require('../controllers/fridgeCtrl');

module.exports = (router) => {
    // router
    //     .route('/:id/get-fridge')
    //     .get(fridgeCtrl.getUserFridge);
    // router
    //     .route('/all-fridges')
    //     .get(fridgeCtrl.getAllFridges);

    // router
    //     .route('/create-fridge')
    //     .post(fridgeCtrl.createFridge);

    // router
    //     .route('/delete-fridge')
    //     .delete(fridgeCtrl.deleteFridge);

    router
        .route('/:id/get-food')
        .get(fridgeCtrl.getUserFood);
    router
        .route('/create-food')
        .post(fridgeCtrl.createFood);

    router
        .route('/delete-multiple-food')
        .delete(fridgeCtrl.deleteMultipleFood);
    router
        .route('/delete-food')
        .delete(fridgeCtrl.deleteFood);

    router
        .route('/all-food')
        .get(fridgeCtrl.getAllFood);
}
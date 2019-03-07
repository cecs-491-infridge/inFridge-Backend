const fridge = require('./fridge');
const post = require('./post');
const user = require('./user');

module.exports = (router) => {
    fridge(router);
    post(router);
    user(router);
}
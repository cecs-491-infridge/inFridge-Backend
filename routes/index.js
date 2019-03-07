const fridge = require('./fridge');
const post = require('./post');
const user = require('./user');
const auth = require('./auth');

module.exports = (router) => {
    fridge(router);
    post(router);
    user(router);
    auth(router);
}

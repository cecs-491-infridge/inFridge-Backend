const user = require('./user');
const post = require('./post');
const auth = require('./auth');
const api = require('./api');

module.exports = (router) => {
    user(router);
    post(router);
    auth(router);
    api(router);
}

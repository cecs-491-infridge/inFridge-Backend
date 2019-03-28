const fridge = require('./fridge');
const post = require('./post');
const user = require('./user');
const auth = require('./auth');
const api = require('./api');
const feed = require('./feed');

module.exports = (router) => {
    fridge(router);
    post(router);
    user(router);
    auth(router);
    api(router);
    feed(router);
	
}

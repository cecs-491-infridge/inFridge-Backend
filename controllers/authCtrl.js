const util = require('../utility/responses');
const User = require('../models/User');

var passport = require('passport');


// const { authenticateUser } = require('../MicrosoftGraph/microsoftGraph');

module.exports = {
        authenticateUser: async (req, res, next) => {
          console.log("Before redirecting");
          // res.send("POST request to go to passport.authenticate");
          console.log("should go to passport.authenticate now");
          await passport.authenticate('azuread-openidconnect',
            {
              response: res,
              prompt: 'login',
              failureRedirect: '/',
              failureFlash: true
            }
          )(req,res,next);
          next();
        },
        authenticateUserRedirect: (req, res) => {
          console.log("passport.authenticate callback");
          res.redirect('/');
        },

        callback: async (req, res, next) => {
          console.log("called callback");
          await passport.authenticate('azuread-openidconnect',
            {
              response: res,
              failureRedirect: '/',
              failureFlash: true
            }
          )(req,res,next);
          next();
        },

        callbackRedirect: (req, res) => {
          console.log("callback redirect");
          // TEMPORARY!
          // Flash the access token for testing purposes
          req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
          res.redirect('/');
        },

        signIn: (req, res) => {
              //{ id, password } = req.body;
              const authKey = authenticateUser(id, password);

              res.status(201).send({
                  message: 'User successfully logged in',
                  authKey //if they're called the same thing, no need for colon
              });

        },

        signout: (req, res) => {
            req.session.destroy(function(err) {
              req.logout();
              res.redirect('/');
            });
        }

}

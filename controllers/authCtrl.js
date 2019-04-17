const util = require('../utility/responses');
const User = require('../models/User');

var passport = require('passport');

const credentials = {
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};

const oauth2 = require('simple-oauth2').create(credentials);


// const { authenticateUser } = require('../MicrosoftGraph/microsoftGraph');


module.exports = {
        authenticateUser: async (req, res) => {
            console.log(oauth2);
            // console.log("Before redirecting");
          // // res.send("POST request to go to passport.authenticate");
          // console.log("should go to passport.authenticate now");
          // await passport.authenticate('azuread-openidconnect',
          //   {
          //     response: res,
          //     prompt: 'login',
          //     failureRedirect: '/',
          //     failureFlash: true
          //   }
          // )(req,res,next);
          // next();
          const authURL = oauth2.authorizationCode.authorizeURL({
            redirect_uri: process.env.OAUTH_REDIRECT_URI,
            scope: process.env.OAUTH_SCOPES
          });
          //res.redirect(authorizationUri);
          res.send({
              authURL
          });
          console.log(`Generated auth url: ${authURL}`);
          //return returnVal;
        },
        // authenticateUserRedirect: (req, res) => {
        //   console.log("passport.authenticate callback");
        //   res.redirect('/');
        // },

        // callback: async (req, res, next) => {
        //   console.log("called callback");
        //   await passport.authenticate('azuread-openidconnect',
        //     {
        //       response: res,
        //       failureRedirect: '/',
        //       failureFlash: true
        //     }
        //   )(req,res,next);
        //   next();
        // },

        // callbackRedirect: (req, res) => {
        //   console.log("callback redirect");
        //   // TEMPORARY!
        //   // Flash the access token for testing purposes
        //   req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
        //   res.redirect('/');
        // },

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

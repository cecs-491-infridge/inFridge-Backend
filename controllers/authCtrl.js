const util = require('../utility/responses');
const User = require('../models/User');
const Request = require('request');

const jwtSigner = require('../utility/jwt');
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
        loginTest: async(req, res) => {
            const userId = req.body;
    
            try {
                // Find User, create JWT from user id
                let userDoc = await User.findById(userId).select('_id');
                jwtSigner.createAndSendToken(
                    {
                        user: {
                            _id: userDoc._id
                        }
                    }, res);

            }catch(err) {
                console.log(err);
                res.status(502).send(err);
            }
        },
        authenticateUser: async (req, res) => {
            console.log(oauth2);
          
            const authURL = oauth2.authorizationCode.authorizeURL({
                redirect_uri: process.env.OAUTH_REDIRECT_URI,
                scope: process.env.OAUTH_SCOPES
            });
            
            res.send({
              authURL
            });
            console.log(`Generated auth url: ${authURL}`);
        },

        verifyToken: async (req,res) => {

            let authToken = req.body.code;
            console.log(authToken);

            // Verify auth token here

            Request({
                headers: {
                    "Authorization":`Bearer ${authToken}`,
                    "Host":"graph.microsoft.com"
                },
                uri: 'https://graph.microsoft.com/v1.0/me',
                method: 'GET'
            }, function (err, res, body) {
                if(err) console.error(err);
                console.log(res);
                                    
            });


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

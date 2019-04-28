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
            const { userId } = req.body;
    
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
            const tokenConfig = {
                code: authToken,
                redirect_uri: 'https://school.corg.network:3002/graph-response',
                scope: process.env.OAUTH_SCOPES
            };

            try {
                const result = await oauth2.authorizationCode.getToken(tokenConfig)
                const accessToken = oauth2.accessToken.create(result);
                console.log("accessToken:");
                console.log(accessToken);
                res.send(200); 
            } catch (error) {
                console.log('Access Token Error', error.message);
                res.send(400);
            }
        },

        verifyUsername: async (req, res) => {
           try {
            const { username } = req.body;
            console.log("USERNAME:");
            console.log(username);
            const user = await User.find({ username });
            console.log("USERRRRRRRRRR:");
            console.log(user);
            if(user.length) return res.status(403).send('Username already exists');
            else res.status(200).send('Username is available');

           } catch (err){
                console.log(err);
           }
        },

        loginUser: async (req, res) => {
            try {
                let  { username, password } = req.body;

                let user = await User.find({name:username,password});
                console.log(user);

                if(user.length>0){
                    res.status(201).send({
			userId: user._id,
			token: 'a'
		    });
                }else{
                    res.status(400).send({
                        error:"Invalid credentials"
                    });
                }
            } catch(err){
                console.log(err);
                res.status(400).send({error:"Invalid credentials"});
            }

        },

        signout: (req, res) => {
            req.session.destroy(function(err) {
              req.logout();
              res.redirect('/');
            });
        }

}

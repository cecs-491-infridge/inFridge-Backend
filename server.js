require('dotenv').config(); //graph API

// MODULES
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// MODELS
const User = require('./models/User');
const { Post } = require('./models/Post');
const Transaction = require('./models/Transaction');

// DATABASE
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/inFridge';
const db = require('./database');
db(MONGO_PATH);

// GRAPH API
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const graph = require('@microsoft/microsoft-graph-client');

module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
  }
};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}

// APP
const port = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(bodyParser.json());


// Configure passport

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
var users = {};

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done (null, user.profile.oid);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

// Configure simple-oauth2
const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
  }
});

// Callback function called once the sign-in is complete
// and an access token has been obtained
async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."), null);
  }

  try{
    const user = await graph.getUserDetails(accessToken);http://school.corg.network:3000/all-users

    if (user) {
      // Add properties to profile
      profile['email'] = user.mail ? user.mail : user.userPrincipalName;
    }
  } catch (err) {
    done(err, null);
  }

  // Create a simple-oauth2 token from raw tokens
  let oauthToken = oauth2.accessToken.create(params);

  // Save the profile and tokens in user storage
  users[profile.oid] = { profile, oauthToken };
  return done(null, users[profile.oid]);
}

// Configure OIDC strategy
passport.use(new OIDCStrategy(
  {
    identityMetadata: '${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}',
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  signInComplete
));

// ROUTES (from'routes/index')
const routes = require('./routes');
const router = express.Router();
routes(router);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  // Set the authenticated user in the
  // template locals
  if (req.user) {
    res.locals.user = req.user.profile;
  }
  next();
});


app.use(router);

app.get('/', (req, res)=> {
    res.send({
        Hello: 'World'
    });
});

app.listen(port, () => console.log('Listening on port ${port}'));

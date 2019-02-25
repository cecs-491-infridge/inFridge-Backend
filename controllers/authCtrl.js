const util = require('../utility/responses');
const User = require('../models/User');
var passport = require('passport');
var express = require('express');

// const { authenticateUser } = require('../MicrosoftGraph/microsoftGraph');

module.exports = {
        authenticateUser: (req, res, next) => {
          passport.authenticate('azuread-openidconnect',
            {
              response: res,
              prompt: 'login',
              failureRedirect: '/',
              failureFlash: true
            }
          )(req,res,next);
        },

        authenticateUser: (req, res) => {
          res.redirect('/');
        },

        callback: (req, res, next) => {
          passport.authenticate('azuread-openidconnect',
            {
              response: res,
              failureRedirect: '/',
              failureFlash: true
            }
          )(req,res,next);
        },

        callback: (req, res) => {
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

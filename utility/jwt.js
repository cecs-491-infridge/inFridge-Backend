/*
This module provides methods to sign and read JWT tokens
*/

const jwt = require('jsonwebtoken');
const publicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');

const i = 'inFridge';
const s = 'User';
const a = 'inFridgeApp'
const signOptions = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: '300d',
    algorithm: 'RS256'
}

module.exports = {
    /*
    Uses the 'jsonwebtoken' library to create and send a JWT back to the api caller
    */
    createAndSendToken: async (payload, res) => {
        try {
            console.log('In createAndSendJwt');
            const token = await jwt.sign(payload, privateKey, signOptions);
            console.log(token);
            
            console.log('token');
            res.send(token)
        }catch(err) {
            console.log(err);
            res.status(500).send('Could not create token');
        }
    },
    /*
    Uses the 'jsonwebtoken' library to create and return a JWT
    */
    createToken: async (payload) => {
        try {
            console.log('In createJwt');
            const token = await jwt.sign(payload, privateKey, signOptions);
            console.log(token);
            
            return token;
        }catch(err) {
            console.log(err);
        }
    },
    /*
    Accepts a JWT and uses the 'jsonwebtoken' library to verify and return a decrypted JWT
    */
    verifyToken: async (token) => {
        try{
            console.log('Verifying');
            const payload = await jwt.verify(token, publicKey, signOptions);

            return payload;
        }catch(err) {
            console.log(err);
        }
    },
    a: () => {
        console.log('In a');
    }
}

// MODULES
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// MODELS
const User = require('./models/User');
const Post = require('./models/Post');
const Transaction = require('./models/Transaction');

// DATABASE
const MONGO_PATH = 'mongodb://localhost:27017/inFridge';
const db = require('./database');
db(MONGO_PATH);

// APP
const port = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(bodyParser.json());

app.get('/', (req, res)=> {
    res.send({
        Hello: 'World'
    });
});

app.get('/get', (req, res) => {

});

app.post('/create-user', async(req, res) => {
    console.log(req.body);

    const { name, password } = req.body;

    const user = new User({
        name,
        password
    });
    try{
        const newUser = await user.save();

        res.status(201).send({
            response: 'New User created!',
            User: newUser
        });
    }catch(err) {
        console.log(err.name+'\n');
        console.log(err.code+'\n');
        console.log(err.message);

        res.status(409).send({
            error: err.name,
            message: err.message
        });
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
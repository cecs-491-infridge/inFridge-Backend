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

// APP
const port = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(bodyParser.json());

// ROUTES (from'routes/index')
const routes = require('./routes');
const router = express.Router();
routes(router);
app.use(router);

app.get('/', (req, res)=> {
    res.send({
        Hello: 'World'
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
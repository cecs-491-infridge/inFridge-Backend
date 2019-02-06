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

app.get('/:userId/post/:postId', (req, res) => {
    const id = req.params.id;
    console.log(id);

    respondWithDataById(res, User, id);
});
app.get('/:userId/all-posts', (req, res) => {
    const id = req.params.id;
    console.log(id);

    getDocByIdAndRespond(res, User, id);
});

// app.post('/:userId/transaction', async(req, res) => {
//     console.log(req.body);

//     const userId = req.params.userId;
//     const { body, location, tradeType } = req.body;

//     const transaction = new Transaction({
//         author: userId,
//         body,
//         location,
//         tradeType
//     });

//     await saveDocAndRespond(res, transaction);
// });

// SHORTCUTS ---------
const str2Id = (str) => {
    return mongoose.Types.ObjectId(str);
}

app.listen(port, () => console.log(`Listening on port ${port}`));
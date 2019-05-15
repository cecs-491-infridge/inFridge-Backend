/*
Module to connet to database
*/

const mongoose = require('mongoose');

/*
Attempts to connect to database,
throws exceptoon on error
*/
const connectToMongo = async (mongoPath) => {
    try {
        await mongoose.connect(mongoPath, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('Mongo connected!');
    }catch(err) {
        console.log(`Error: ${err}`);
    }
}

module.exports = connectToMongo;
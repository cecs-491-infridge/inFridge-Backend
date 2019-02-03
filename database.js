const mongoose = require('mongoose');

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
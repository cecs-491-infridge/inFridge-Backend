const mongoose = require('mongoose');

let LocationSchema = new mongoose.Schema({
	longitude: Number,
	latitude: Number 
});

module.exports = {
	Location: mongoose.model('Location', LocationSchema),
	Schema: LocationSchema
}

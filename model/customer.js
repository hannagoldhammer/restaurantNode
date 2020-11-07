const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CustomerSchema = new Schema({
	id: Number,
	firstName: String,
	lastName: String,
	email: String,
	phone: String,
});

const CS = mongoose.model('Customer', CustomerSchema);

module.exports = CS;

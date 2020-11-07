const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookingSchema = new Schema({
	date: String,
	time: Number,
	guests: Number,
	message: String,
	customerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Customer',
	},
});

const BS = mongoose.model('Booking', BookingSchema);
module.exports = BS;

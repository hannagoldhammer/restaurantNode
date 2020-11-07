const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../config/config');
const BookingModel = require('../model/booking');
const CustomerModel = require('../model/customer');


let smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use SSL

	auth: {
		user: config.email,
		pass: config.password,
	}
};

let transporter = nodemailer.createTransport(smtpConfig);




router.get('/bookings', async (req, res) => {
	const bookings = await BookingModel.find();

	res.send(bookings);
});

router.get('/delete/:id', async (req, res) => {
	await BookingModel.deleteOne({ _id: req.params.id });
	res.send('delete done')
});

router.get('/customers', async (req, res) => {
	const customers = await CustomerModel.find();
	res.send(customers);
});

router.post('/', async (req, res) => {
	const user = await CustomerModel.findOne({ email: req.body.email });

	if (!user) {
		new CustomerModel({
			firstName: (string = req.body.firstName),
			lastName: (string = req.body.lastName),
			email: (string = req.body.email),
			phone: (string = req.body.phone),
		})
			.save()
			.then(async () => {
				const newUser = await CustomerModel.findOne({ email: req.body.email });

				new BookingModel({
					date: (number = req.body.date),
					time: (number = req.body.time),
					guests: (number = req.body.guests),
					message: (string = req.body.message),
					customerId: (string = newUser._id),
				}).save().then((booking)=> {

					const newBooking = {
						newUser,
						booking
					}

					let mailContent = {
						from: 'restaurantdinnerspace@gmail.com',
						to: user.email,
						subject: `Välkommen till DinnerSpace ${user.firstName}`,
						text: `Välkommen till Dinner Space ${user.firstName + " " + user.lastName}. 
						Du har bokat bord hos oss den ${booking.date} klockan ${booking.time}.00.
						Vi hoppas ni får en trevlig middag hos oss. Skulle ni behöva göra ändringar i er bokning
						är ni välkomna att ringa oss på telefonnummer 08-123 345`
					};
				
					transporter.sendMail(mailContent, function (error, info) {
				
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent (info.response): ', info.response);
						}
				
					});

					res.send(newBooking)
				});

			});

	} else {
		new BookingModel({
			date: (number = req.body.date),
			time: (number = req.body.time),
			guests: (number = req.body.guests),
			message: (string = req.body.message),
			customerId: (string = user._id),
		}).save().then((booking)=> {
			let mailContent = {
				from: 'restaurantdinnerspace@gmail.com',
				to: user.email,
				subject: `Välkommen till DinnerSpace ${user.firstName}`,
				text: `Välkommen till Dinner Space ${user.firstName + " " + user.lastName}. 
				Du har bokat bord hos oss den ${booking.date} klockan ${booking.time}.00.
				Vi hoppas ni får en trevlig middag hos oss. Skulle ni behöva göra ändringar i er bokning
				är ni välkomna att ringa oss på telefonnummer 08-123 345`
			};
		
			transporter.sendMail(mailContent, function (error, info) {
		
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent (info.response): ', info.response);
				}
	
			});

			const newBooking = {
				user,
				booking
			}
	
			res.send(newBooking)
		});

	};
});

router.delete('/delete/:id', async (req, res) => {

	const booking = await BookingModel.findOne({ _id: req.params.id });
	const guest = await CustomerModel.findOne({
		_id: booking.customerId

	});

	let mailDeleteContent = {
		from: 'restaurantdinnerspace@gmail.com',
		to: guest.email,
		subject: `Din avbokning hos DinnerSpace ${guest.firstName}.`,
		text: `Hej ${guest.firstName + " " + guest.lastName}.
	Här kommer en bekräftelse på din avbokning för ${ booking.date} klockan ${booking.time} .00.
	Vi hoppas vi ses en annan gång.
		Hälsningar
	gänget på DinnerSpace`
	};

	transporter.sendMail(mailDeleteContent, function (error, info) {

		if (error) {
			console.log(error);
		} else {
			console.log('Email sent (info.response): ', info.response);
		}
	});
	booking.delete();
	res.send();

});



router.put('/update/:id', async (req, res) => {
	await BookingModel.updateOne(
		{ _id: req.params.id },
		{
			$set: {
				date: req.body.newBooking.date,
				time: req.body.newBooking.time,
				guests: req.body.newBooking.guests,
				message: req.body.newBooking.message,
			},
		}
	);

	res.send('booking updated');
});

module.exports = router;

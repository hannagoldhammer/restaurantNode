const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');

const bodyParser = require('body-parser');
const mainRouter = require('./router/mainRouter');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

// Routing
app.use(mainRouter);

// Error handling
app.get('*', (req, res) => res.send('404'));

// Hosting
const PORT = process.env.PORT || 8000;
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
};

mongoose.connect(config.databaseURL, options).then(() => {
	console.log('Server is hosted on port ' + PORT);
	app.listen(PORT);
});

module.exports = app;

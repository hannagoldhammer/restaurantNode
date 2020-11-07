if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const config = {
    databaseURL: process.env.DATABASE,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    email: process.env.EMAIL,
    password: process.env.PASSWORD
};

module.exports = config;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config');
const express = require('express');

module.exports = (app) => {

    app.use(cors({
        exposedHeaders: 'Authorization'
    }));

    app.use(express.json());

    app.use(express.urlencoded({
        extended: true
    }));

    app.use(cookieParser(config.cookieSecret));
};
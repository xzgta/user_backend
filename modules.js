let dotenv = require('dotenv').config();

let express = require('express');
let app = express();
app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
module.exports.app = app;

let cors = require('cors');
app.use(cors());

let helmet = require('helmet')
app.use(helmet())

let mysql = require('mysql');
let database = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
};
module.exports.db = mysql.createPool(database);
module.exports.jwt = require('jsonwebtoken');
module.exports.crypto = require('crypto-js');
module.exports.uuidv1 = require('uuid/v1');
module.exports.validator = require('validator');
module.exports.function = require('./function.js');
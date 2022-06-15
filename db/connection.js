const config = require('config');
const user = config.get('server.user');
const pw = config.get('server.password');
const database = config.get('server.database');
const host = config.get('server.host')

const mysql = require('mysql2');

// Connect to Database
const db = mysql.createConnection(
    {
        host: host,
        user: user,
        password: pw,
        database: database
    },
    console.log('Connected to the database')
);

module.exports = db;
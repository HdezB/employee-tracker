const config = require('config');
const user = config.get('server.user');
const pw = config.get('server.password');
const database = config.get('server.database');
const host = config.get('server.host')

const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// Default response for any other request (Not Found)
app.get((req, res) => {
    res.status(404).end()
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
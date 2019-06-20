const database = require('mysql');

require('dotenv').config();

const db_connection = database.createPool({
    connectionLimit: 1000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_TABLE
});

db_connection.getConnection((err, conn) => {});

module.exports = db_connection;
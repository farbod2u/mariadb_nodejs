// db.js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'maria-db',
    user: 'root',
    password: 'wHu8QBfsjxcx6186Ko4FhkbS',
    database: 'gifted_greider',
    connectionLimit: 5
});

module.exports = pool;

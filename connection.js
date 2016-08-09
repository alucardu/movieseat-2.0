// Load module
var mysql = require('mysql');

// Initialize pool
var pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'bfe4a8980ede74',
    password : '67425669',
    database : 'heroku_0b954ee0f0e9102',
    debug    :  false
});

module.exports = pool;


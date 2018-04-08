var mysql = require('mysql');

var connection = mysql.createPool({
 connectionLimit: 1000,
 host:'localhost',
 user:'root',
 password:'',
 database:'nurserydatabase',
 debug: false,
 multipleStatements: true
});

module.exports.connection = connection;
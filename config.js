const mysql = require('mysql');
// SAMPLE VALUES
var pool = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'',
	database:'store'
})

module.exports = pool;
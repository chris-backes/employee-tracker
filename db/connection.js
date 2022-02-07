const mysql = require("mysql2");

module.exports = mysql.createConnection(
	{
		host: "localhost",
		user: "root",
		password: "mysqL_passworD_tO_mY_accounT_912",
		database: "election",
	},
	console.log("Connected to the election database.")
);
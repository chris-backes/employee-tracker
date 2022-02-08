const inquirer = require("inquirer");

const list = [
	"View All Departments",
	"View All Roles",
	"View All Employees",
	"Add a Department",
	"Add a Role",
	"Add an Employee",
	"Update Employee Role",
    "Exit"
];

module.exports = function() {
	console.log(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    What would you like to do?
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
	return inquirer.prompt({
		type: "list",
		name: "options",
		message: "Select one",
		choices: list,
	});
};

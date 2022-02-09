const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");
const redirectQuestion = require("./utils/redirectQuestion");

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

function init() {
	console.log(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    What would you like to do?
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
	inquirer.prompt({
		type: "list",
		name: "options",
		message: "Select one",
		choices: list,
	})
    .then((data) => {
        redirectQuestion(data.options)
    })
    .then(() => {
        init()
    })
    .catch(err => {
        console.log(err);
    })
};

init();
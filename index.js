const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");
const Database = require("./lib/Database");
const process = require('process');
const { addDept } = require("./lib/Database");

const list = [
	"View All Departments",
	"View All Roles",
	"View All Employees",
	"Add a Department",
	"Add a Role",
	"Add an Employee",
	"Update Employee Role",
	"Exit",
];

const init = async () => {
	console.log(`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    What would you like to do?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
	const res = await inquirer.prompt({
		type: "list",
		name: "options",
		message: "Select one",
		choices: list,
	});
	hello(res.options)


	// const  next = await redirectQuestion(res.options)

	// const nextNext = await init()
};

async function hello(param) {
	switch (param) {
		case "View All Departments":
			const [department] = await Database.getTableDept();
			console.table(department);
			break;
		case "View All Roles":
			const [role] = await Database.getTableRole();
			console.table(role);
			break;
		case "View All Employees":
			const [employees] = await Database.getTableEmply();
			console.table(employees);
			break;
		case "Add a Department":
			const deptRes = await addDept()
			console.log(deptRes)
			break;
		case "Add a Role":
			return addRole();
		case "Add an Employee":
			return addEmpl();
		case "Update Employee Role":
			return updateEmpl();
		case "Exit":
			console.log("Goodbye!");
			return process.exit();
		default:
			return console.log("you done goofed");
	}
	init();
}

init();

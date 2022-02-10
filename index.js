const inquirer = require("inquirer");
const mysql = require("mysql2");
const clc = require('cli-color')
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
	console.log(clc.blueBright.bgBlackBright(`
                                                   
╔═══╗─────╔╗──────────────╔═══╗──╔╗───╔╗           
║╔══╝─────║║──────────────╚╗╔╗║─╔╝╚╗──║║           
║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗─║║║╠═╩╗╔╬══╣╚═╦══╦══╦══╗
║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣─║║║║╔╗║║║╔╗║╔╗║╔╗║══╣║═╣
║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣╔╝╚╝║╔╗║╚╣╔╗║╚╝║╔╗╠══║║═╣
╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚═══╩╝╚╩═╩╝╚╩══╩╝╚╩══╩══╝
───────║║──────╔═╝║                                
───────╚╝──────╚══╝                                
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~           
          What would you like to do?               
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~           `));
	const res = await inquirer.prompt({
		type: "list",
		name: "options",
		message: "Select one",
		choices: list,
	});
	redirectQuestion(res.options)

};

async function redirectQuestion(param) {
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
			await addDept()
			const [newDept] = await Database.getTableDept();
			console.table(newDept);
			console.log('New Department Added!')
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

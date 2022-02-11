const inquirer = require("inquirer");
const clc = require("cli-color");
const Database = require("./lib/Database");
const process = require("process");

//this sits outside of a function so that it only gets called at the beginning
console.log(
	clc.blueBright.bgBlackBright(`
                                                                                 
  ╔════╗──────────╔═╗────────────────────╔═════╗────╔═╗─────╔═╗                  
  ║ ╔══╝──────────║ ║────────────────────╚╗ ╔╗ ║───╔╝ ╚╗────║ ║                  
  ║ ╚══╦═╗─╔═╦════╣ ║╔════╦═╗─╔═╦═══╦═══╗─║ ║║ ╠═══╩╗ ╔╬════╣ ╚══╦════╦═══╦═══╗  
  ║ ╔══╣ ╚═╝ ║ ╔╗ ║ ║║ ╔╗ ║ ║─║ ║ ══╣ ══╣─║ ║║ ║ ╔╗ ║ ║║ ╔╗ ║ ╔╗ ║ ╔╗ ║ ══╣ ══╣  
  ║ ╚══╣ ║ ║ ║ ╚╝ ║ ╚╣ ╚╝ ║ ╚═╝ ║ ══╣ ══╣╔╝ ╚╝ ║ ╔╗ ║ ╚╣ ╔╗ ║ ╚╝ ║ ╔╗ ╠══ ║ ══╣  
  ╚════╩═╩═╩═╣ ╔══╩══╩════╩═══╗ ║═══╩═══╝╚═════╩═╝╚═╩══╩═╝╚═╩════╩═╝╚═╩═══╩═══╝  
  ───────────║ ║────────────╔═╝ ║                                                
  ───────────╚═╝────────────╚═══╝                                                
                                                                                 `)
);

//I implementend a timeout so that the call to the menu isn't immediate; I think it provides a better user experience
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const init = async () => {
	console.log(
		clc.blueBright.bgBlackBright(`
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                          
                         What would you like to do?                              
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                          `)
	);
	const res = await inquirer.prompt({
		type: "list",
		name: "options",
		message: "Select one",
		choices: [
			"View All Departments",
			"View All Roles",
			"View All Employees",
			"Add a Department",
			"Add a Role",
			"Add an Employee",
			"Update Employee Role",
			"Exit",
		],
	});
	redirectQuestion(res.options);
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
			await Database.addDept();
			const [newDept] = await Database.getTableDept();
			console.log("New Department Added!");
			await sleep();
			console.table(newDept);
			break;
		case "Add a Role":
			await Database.addRole();
			const [newRole] = await Database.getTableRole();
			console.log("New Role Added!");
			await sleep();
			console.table(newRole);
			break;
		case "Add an Employee":
			await Database.addEmply();
			const [newEmploy] = await Database.getTableEmply();
			console.log("New Employee Added!");
			await sleep();
			console.table(newEmploy);
			break;
		case "Update Employee Role":
			await Database.updateEmply();
			break;
		case "Exit":
			//Since this entire application leaves the connection to the database open, I've added a feature to kill the terminal process without having to hit ctrl + C
			console.log("Goodbye!");
			return process.exit();
		default:
			return console.log("you done goofed");
	}
	await sleep();
	init();
}

init();

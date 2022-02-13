const inquirer = require("inquirer");
const clc = require("cli-color");
const Database = require("./lib/Database");
const cTable = require("console.table");
const { viewDeptTeam } = require("./lib/Database");

//this sits outside of a function so that it only gets called at the beginning
console.log(
	clc.blueBright.bgBlackBright(`
                                                                                 
  ╔════╗──────────╔═╗────────────────────╔═════╗────╔═╗─────╔═╗──────            
  ║ ╔══╝──────────║ ║────────────────────╚╗ ╔╗ ║───╔╝ ╚╗────║ ║───────────       
  ║ ╚══╦═╗─╔═╦════╣ ║╔════╦═╗─╔═╦═══╦═══╗─║ ║║ ╠═══╩╗ ╔╬════╣ ╚══╦════╦═══╦═══╗  
  ║ ╔══╣ ╚═╝ ║ ╔╗ ║ ║║ ╔╗ ║ ║─║ ║ ══╣ ══╣─║ ║║ ║ ╔╗ ║ ║║ ╔╗ ║ ╔╗ ║ ╔╗ ║ ══╣ ══╣  
  ║ ╚══╣ ║ ║ ║ ╚╝ ║ ╚╣ ╚╝ ║ ╚═╝ ║ ══╣ ══╣╔╝ ╚╝ ║ ╔╗ ║ ╚╣ ╔╗ ║ ╚╝ ║ ╔╗ ╠══ ║ ══╣  
  ╚════╩═╩═╩═╣ ╔══╩══╩════╩═══╗ ║═══╩═══╝╚═════╩═╝╚═╩══╩═╝╚═╩════╩═╝╚═╩═══╩═══╝  
   ──────────║ ║───────────╔══╝ ║──────────────────────────────                  
       ──────╚═╝───────────╚════╝───────────────                                 
                                                                                 `)
);

//I implementend a timeout so that the call to the menu isn't immediate; I think it provides a better user experience. The idea was
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const init = async () => {
	console.log(
		clc.blueBright.bgBlackBright(`
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                
                         What would you like to do?                              
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                `)
	);
	const res = await inquirer.prompt({
		type: "list",
		name: "options",
		message: "Select one",
		choices: [
			"View All Departments",
			"View All Roles",
			"View All Employees",
			"View All Employees by Manager",
			"View All Employees by Department",
			"Add a Department",
			"Add a Role",
			"Add an Employee",
			"Update Employee Role and/or Manager",
			"Delete Department",
			"Delete Role",
			"Delete Employee",
			"Get Budget",
			"Find Employee",
			"Get Budget, Head Count, and Average Salary",
			"View employees of specific department",
			"Exit",
		],
	});
	redirectQuestion(res.options);
};

async function redirectQuestion(param) {
	switch (param) {
		case "View All Departments":
			const [department] = await Database.getTable("department");
			console.table(department);
			break;
		case "View All Roles":
			const [role] = await Database.getTable("role");
			console.table(role);
			break;
		case "View All Employees":
			const [employees] = await Database.getTable("employee", "");
			console.table(employees);
			break;
		case "View All Employees by Manager":
			const [employeesManager] = await Database.getTable(
				"employee",
				"Order by manager"
			);
			console.table(employeesManager);
			break;
		case "View All Employees by Department":
			const [employeesDepartment] = await Database.getTable(
				"employee",
				"Order by department"
			);
			console.table(employeesDepartment);
			break;
		case "Add a Department":
			await Database.addDept();
			const [newDept] = await Database.getTable("department");
			console.log("New Department Added!");
			await sleep();
			console.table(newDept);
			break;
		case "Add a Role":
			await Database.addRole();
			const [newRole] = await Database.getTable("role");
			console.log("New Role Added!");
			await sleep();
			console.table(newRole);
			break;
		case "Add an Employee":
			await Database.addEmply();
			const [newEmploy] = await Database.getTable("employee");
			console.log("New Employee Added!");
			await sleep();
			console.table(newEmploy);
			break;
		case "Update Employee Role and/or Manager":
			await Database.updateEmply();
			console.log("Employee updated!");
			break;
		case "Delete Department":
			await Database.deleteEntry("department");
			console.log("Entry Deleted");
			break;
		case "Delete Role":
			await Database.deleteEntry("role");
			console.log("Entry Deleted");
			break;
		case "Delete Employee":
			await Database.deleteEntry("employee");
			console.log("Entry Deleted");
			break;
		case "Get Budget":
			const [budget] = await Database.getBudgetInfo(`SELECT
				department.name AS Department,
				SUM(role.salary) AS Budget
			FROM
				employee
			LEFT JOIN
				role ON employee.role_id = role.id
			LEFT JOIN
				department ON role.department_id = department.id
			GROUP BY
				department.name;`);
			console.table(budget);
			break;
		case "Find Employee":
			const [findEmployeeResults] = await Database.findEmployee();
			console.table(findEmployeeResults);
			break;
		case "Get Budget, Head Count, and Average Salary":
			const [budgetAndMore] = await Database.getBudgetInfo(`SELECT 
				department.name AS Department,
				COUNT(1) AS 'Employees per Dept',
				SUM(role.salary) AS Budget,
				TRUNCATE(AVG(role.salary), 2) AS 'Average Salary'
			FROM employee
			LEFT JOIN
				role ON employee.role_id = role.id
			LEFT JOIN
				department ON role.department_id = department.id
			GROUP BY
				department.id;`);
			console.table(budgetAndMore);
			break;
		case 'View employees of specific department': 
			const [viewByDept] = await Database.viewDeptTeam();
			console.table(viewByDept)
			break;
		case "Exit":
			//Since this entire application leaves the connection to the database open, I've added a feature to kill the terminal process without having to hit ctrl + C
			console.log("Goodbye!");
			await sleep();
			return process.exit();
		default:
			console.log("An error has occured");
			return process.exit();
	}
	await sleep();
	init();
}

init();

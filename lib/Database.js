const db = require("../db/connection");
const inquirer = require("inquirer");

class Database {
	getTableDept() {
		return db.promise().query(`SELECT * FROM department ORDER BY id`);
	}
	getTableRole(order) {
		return db.promise().query(`SELECT
			roles.id,
			roles.title,
			roles.salary,
			department.name as department
		FROM
			roles
		LEFT JOIN 
			department on roles.department_id = department.id;`);
	}
	//if left blank, satifies the condition of returning all employees. the sort by manager or sort by dept pass in a string to satify the condition
	getTableEmply(order) {
		return db.promise().query(`SELECT
			employee.id,
			employee.first_name AS 'First_Name',
			employee.last_name AS 'Last_Name',
			roles.title AS 'Title',
			roles.salary AS 'Salary',
			department.name AS 'Department',
			q.last_name AS 'Manager',
			employee.manager_id
		FROM
			employee
		LEFT JOIN 
			roles on employee.roles_id = roles.id
		LEFT JOIN
			department on roles.department_id = department.id 
		LEFT JOIN
			employee q ON (employee.manager_id = q.id)
		${order};`);
	}
	async addDept() {
		const dept = await inquirer.prompt({
			type: "input",
			name: "department",
			message: "What dept are we adding?",
			validate: (deptInput) => !!deptInput,
		});
		await db.promise().execute(
			`INSERT INTO department (name)
                        VALUES (?)`,
			[dept.department],
			(err, result) => {
				if (err) {
					return "Error";
				} else {
					return "Success";
				}
			}
		);
	}
	async addRole() {
		const [department] = await this.getTableDept();
		const deptChoices = department.map(({ id, name }) => ({
			name: name,
			value: id,
		}));
		const role = await inquirer.prompt([
			{
				type: "input",
				name: "title",
				message: "What job title are you adding?",
				validate: (roleInput) => (roleInput.length > 30 ? false : true),
			},
			{
				type: "list",
				name: "newDept",
				message: "What department is this job in?",
				choices: deptChoices,
			},
			{
				type: "input",
				name: "salary",
				message:
					"How much does the position pay (make sure to include the decimal values)?",
				//Should only accept dollar amounts
				validate: (salaryInput) =>
					/([0-9]+[\,])?([0-9]+[\.,])+([0-9]{2})+/.test(salaryInput),
			},
		]);
		await db.promise().execute(
			`INSERT INTO roles (title, salary, department_id)
				VALUES (?, ?, ?)`,
			[role.title, role.salary, role.newDept],
			(err, result) => {
				if (err) {
					console.log(err);
				} else {
					console.log(result);
				}
			}
		);
	}
	async addEmply() {
		const [role] = await this.getTableRole();
		const roleChoices = role.map(({ id, title }) => ({
			name: title,
			value: id,
		}));
		//Just pulls up a list of the managers by referenceing who does not have a manager. Not the cleanest solution
		const [employee] = await this.getTableEmply();
		const emplyChoices = employee
			.filter((a) => a.manager_id === null)
			.map(({ id, First_Name, Last_Name }) => ({
				name: First_Name + " " + Last_Name,
				value: id,
			}));
		const emply = await inquirer.prompt([
			{
				type: "input",
				name: "first_name",
				message: "What is this person's first name?",
				validate: (roleInput) => (roleInput.length > 30 ? false : true),
			},
			{
				type: "input",
				name: "last_name",
				message: "What is this person's last name?",
				validate: (roleInput) => (roleInput.length > 30 ? false : true),
			},
			{
				type: "list",
				name: "roles",
				message: "What is this person's job",
				choices: roleChoices,
			},
			{
				type: "confirm",
				name: "managerConfirm",
				message: "Is this person a manager",
				default: true,
			},
			{
				type: "list",
				name: "manager",
				message: "Who is this person's Manager",
				choices: emplyChoices,
				when: ({ managerConfirm }) => {
					return !managerConfirm;
				},
			},
		]);
		await db.promise().execute(
			`INSERT INTO employee (first_name, last_name, roles_id, manager_id)
			            VALUES (?, ?, ?, ?)`,
			[
				emply.first_name,
				emply.last_name,
				emply.roles,
				emply.manager || null,
			],
			(err, result) => {
				if (err) {
					console.log("There was an error adding to the table");
				} else {
					console.log("Success!");
				}
			}
		);
	}
	async updateEmply() {
		const [role] = await this.getTableRole();
		const roleChoices = role.map(({ id, title }) => ({
			name: title,
			value: id,
		}));
		const [emply] = await this.getTableEmply();
		const emplyChoices = emply.map(({ id, First_Name, Last_Name }) => ({
			name: First_Name + " " + Last_Name,
			value: id,
		}));
		const managerChoices = emply
			.filter((a) => a.manager_id === null)
			.map(({ id, First_Name, Last_Name }) => ({
				name: First_Name + " " + Last_Name,
				value: id,
			}));
		const update = await inquirer.prompt([
			{
				type: "list",
				name: "employee",
				message: "which employee are we updating?",
				choices: emplyChoices,
			},
			{
				type: "list",
				name: "role",
				message: "what is his new job?",
				choices: roleChoices,
			},
			{
				type: "confirm",
				name: "managerConfirm",
				message: "Is this person a manager",
				default: true,
			},
			{
				type: "list",
				name: "manager",
				message: "who is the new manager?",
				choices: managerChoices,
				when: ({ managerConfirm }) => {
					return !managerConfirm;
				},
			},
		]);
		await db.promise().execute(
			`UPDATE employee
			SET roles_id=?
			where id=?;`,
			[update.role, update.manager || null, update.employee],
			(err, result) => {
				if (err) {
					return "Error";
				} else {
					return "Success";
				}
			}
		);
	}
	getBudget() {
		return db.promise().query(`SELECT
				department.name,
				SUM(roles.salary) AS Salary
			FROM
				employee
			LEFT JOIN
				roles ON employee.roles_id = roles.id
			LEFT JOIN
				department ON roles.department_id = department.id
			GROUP BY
				department.name;`);
	}
}

module.exports = new Database();

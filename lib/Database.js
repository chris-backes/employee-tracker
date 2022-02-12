const db = require("../db/connection");
const inquirer = require("inquirer");

class Database {
	//if left blank, satifies the condition of returning all employees. 
	//the sort by manager or sort by dept choices in the first inquirer pass 
	//in a string to satify the condition for sorting
	getTable(table, order ='') {
		if (table === 'department') {
			return db.promise().query(`SELECT * FROM department ORDER BY id`)
		} else if (table === 'roles') {
			return db.promise().query(`SELECT
			roles.id,
			roles.title AS Title,
			roles.salary AS Salary,
			department.name as Department
		FROM
			roles
		LEFT JOIN 
			department on roles.department_id = department.id;`);
		} else if (table === 'employee') {
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
		${order};`)
		} else {
			console.log('something must have gone wrong')
			return;
		}
	}
	async addDept() {
		const dept = await inquirer.prompt({
			type: "input",
			name: "department",
			message: "What dept are we adding (Must be 30 characters or less)?",
			validate: (deptInput) => (deptInput.length > 30 ? false : true) //checks for length
		});
		await db.promise().execute(
			`INSERT INTO department (name)
                        VALUES (?)`,
			[dept.department],
			(err, result) => {
				if (err) {
					return err;
				} else {
					return;
				}
			}
		);
	}
	async addRole() {
		const [department] = await this.getTable('department');
		const deptChoices = department.map(({ id, name }) => ({
			name: name,
			value: id,
		}));
		const role = await inquirer.prompt([
			{
				type: "input",
				name: "title",
				message:
					"What job title are you adding (Must be 30 characters or less)?",
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
					"How much does the position pay (Make sure to include the decimal values)?",
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
					return err;
				} else {
					return;
				}
			}
		);
	}
	async addEmply() {
		const [role] = await this.getTable('roles');
		const roleChoices = role.map(({ id, Title }) => ({
			name: Title,
			value: id,
		}));
		//Just pulls up a list of the managers by referenceing who does not have a manager. Not the cleanest solution
		const [employee] = await this.getTable('employee');
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
		const [role] = await this.getTable('roles');
		const roleChoices = role.map(({ id, Title }) => ({
			name: Title,
			value: id,
		}));
		const [emply] = await this.getTable('employee');
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
				message: "who is their new manager?",
				choices: managerChoices,
				when: ({ managerConfirm }) => {
					return !managerConfirm;
				},
			},
		]);
		await db.promise().execute(
			`UPDATE employee
			SET roles_id=?,
				manager_id=?
			WHERE id=?;`,
			[update.role, update.manager || null, update.employee],
			(err, result) => {
				if (err) {
					return err;
				} else {
					return;
				}
			}
		);
	}
	async deleteEntry(table) {
		//the deletechoicesarray gets set to the results of the matching table
		const [deleteChoicesArray] = await this.getTable(table)
		//the object gets mapped according the procedure 
		const deleteChoicesObjects =
			table === "employee"
				? deleteChoicesArray.map(({ id, First_Name, Last_Name }) => ({
						name: First_Name + " " + Last_Name,
						value: id,
				  }))
				: table === "roles"
				? deleteChoicesArray.map(({ id, title }) => ({
						name: title,
						value: id,
				  }))
				: deleteChoicesArray.map(({ id, name }) => ({
						name: name,
						value: id,
				  }));
		const deleteEntry = await inquirer.prompt({
			type: "list",
			name: "entry",
			message: "What are you deleting?",
			choices: deleteChoicesObjects,
		});

		await db.promise().execute(
			`DELETE FROM ${table}
			where id=?;`,
			[deleteEntry.entry],
			(err, result) => {
				if (err) {
					return err;
				} else {
					return;
				}
			}
		);
	}
	//only displays 
	getBudget() {
		return db.promise().query(`SELECT
				department.name AS Department,
				SUM(roles.salary) AS Budget
			FROM
				employee
			LEFT JOIN
				roles ON employee.roles_id = roles.id
			LEFT JOIN
				department ON roles.department_id = department.id
			GROUP BY
				department.name;`);
	}
	async findEmployee() {
		const [emply] = await this.getTable('employee');
		const emplyChoices = emply.map(({ id, First_Name, Last_Name }) => ({
			name: First_Name + " " + Last_Name,
			value: id,
		}));
		const update = await inquirer.prompt({
			type: "list",
			name: "employee",
			message: "which employee are we updating?",
			choices: emplyChoices,
		})
		return this.getTable('employee', `WHERE employee.id = ${update.employee}`)
	}
}

module.exports = new Database();

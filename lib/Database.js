const db = require("../db/connection");
const inquirer = require("inquirer");

class Database {
	getTableDept() {
		return db.promise().query(`SELECT * FROM department ORDER BY id`);
	}
	getTableRole() {
		return db.promise().query(`SELECT * FROM roles ORDER BY id`);
	}
	getTableEmply() {
		return db.promise().query(`SELECT * FROM employee ORDER BY id`);
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
				choices: deptChoices
			},
			{
				type: "input",
				name: "salary",
				message: "How much does the position pay (make sure to include the decimal values)?",
				//Should only accept dollar amounts
				validate: (salaryInput) => /([0-9]+[\,])?([0-9]+[\.,])+([0-9]{2})+/.test(salaryInput),
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
	async addEmpl() {
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'first_name',
					message: "What is this person's first name?",
					validate: (roleInput) => roleInput.length > 30 ? false : true
				},
				{
					type: 'input',
					name: 'last_name',
					message: "What is this person's last name?",
					validate: (roleInput) => roleInput.length > 30 ? false : true
				},
				{
					type: 'list',
					name: 'roles',
					message: "What is this person's job", 
					// choices:
				},
				{
					type: 'input',
					name: 'salary',
					message: "How much does the position pay (if none, hit 'enter'?", 
					default: null,
				}
			])
			// .then(({ department }) => {
			//     db.execute(
			//         `INSERT INTO roles (name)
			//             VALUES (?)`, [department], (err, result) => {
			//                 if (err) {
			//                     console.log('There was an error adding to the table')
			//                 } else {
			//                     console.log('Success!')
			//                 }
			//             }
			//     )
			// })
	}
}

module.exports = new Database();

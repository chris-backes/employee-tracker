const db = require("../db/connection");
const inquirer = require("inquirer");

class Database {
	getTableDept() {
		return db.promise().query(`SELECT * FROM department ORDER BY id`);
	}
	getTableRole() {
		return db.promise().query(`SELECT * FROM role ORDER BY id`);
	}
	getTableEmply() {
		return db.promise().query(`SELECT * FROM employees ORDER BY id`);
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
					return 'Error'
				} else {
					return 'Success'
				}
			}
		);
	}
}

module.exports = new Database();

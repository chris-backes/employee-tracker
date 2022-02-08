const db = require("../db/connection")

function viewDept() {
    db.execute(
        'SELECT * FROM department ORDER BY id', (err, results, fields) => {
            if (err) {
                console.log("There was an error with your request")
                return;
            }
            console.log(results)
        }
    )
}

function viewRoles() {
    db.execute(
        'SELECT * FROM roles ORDER BY id', (err, results, fields) => {
            if (err) {
                console.log("There was an error with your request")
                return;
            }
            console.log(results)
        }
    )
}

function viewEmpl() {
    db.execute(
        'SELECT * FROM employee ORDER BY id', (err, results, fields) => {
            if (err) {
                console.log("There was an error with your request")
                return;
            }
            console.log(results)
        }
    )
}

module.exports = { viewDept, viewRoles, viewEmpl }
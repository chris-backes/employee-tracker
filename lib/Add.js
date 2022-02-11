const inquirer = require("inquirer")
const db = require("../db/connection")


function addEmpl() {
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

module.exports = addDept
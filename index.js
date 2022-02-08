const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require("mysql2");
const db = require("./db/connection")
const redirectQuestion = require('./utils/redirectQuestion')
const viewTables = require('./utils/viewTables')
const list = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role'];

const userPrompt = () => {
    console.log(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    What would you like to do?
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    `)
    return inquirer
        .prompt({
            type: 'list',
            name: 'options',
            message:'Select one',
            choices: list
        })
}

db.execute(
    'SELECT * FROM employee ORDER BY id', (err, results, fields) => {
        if (err) {
            console.log("There was an error with your request")
            return;
        }
        console.log(results)
    }
)

// userPrompt()
//     .then((data) => {
//     return redirectQuestion(data.options)
//     })
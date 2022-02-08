const View = require('../lib/View')
const addDept = require('../lib/Add')
const process = require('process')

module.exports = function (response) {
    console.log(response)
    switch (response) {
        case 'View All Departments':
            return new View('department').getTable();
        case  'View All Roles':
            return new View('roles').getTable();
        case 'View All Employees':
            return new View('employee').getTable();
        case 'Add a Department':
            return addDept();
        case 'Add a Role':
            return addRole();
        case 'Add an Employee':
            return addEmpl();
        case 'Update Employee Role':
            return updateEmpl();
        case 'Exit':
            console.log('Goodbye!')
            return process.exit();
        default:
            return console.log('you done goofed');
    }
}
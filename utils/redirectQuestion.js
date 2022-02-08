const { viewDept, viewRoles, viewEmpl } = require('./viewTables')

module.exports = function (response) {
    console.log(response)
    switch (response) {
        case 'View All Departments':
            viewDept();
            break;
        case  'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmpl();
            break;
        case 'Add a Department':
            addDept();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmpl();
            break;
        case 'Update Employee Role':
            updateEmpl();
            break;
        default:
            console.log('you done goofed')
            return;
    }
}
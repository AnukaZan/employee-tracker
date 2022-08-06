const mysql = require('mysql2');
const inquirer = require("inquirer");
const conTable = require('console.table');
//require('dotenv').config();

//connect to DB
const db = mysql.createConnection(
    {
        host: 'localhost', 
        user: 'root',
        password: 'root',
        database: 'employees'
    }
);
db.connect(err => {
    if (err) throw err;
    promptUser();
});

const promptUser = () =>{
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Add a Department', 
                'Add a Role', 
                'Add an Employee', 
                'Update an employee role'
            ]
        }
    ]).then((answers) => {     
        const choice = answers.choices;
        
        if (choice === 'View All Departments'){
            console.log('All Departments:');
            showDept();
            return;
        }
        // if (choice === 'View All Roles'){
        //     showRoles();
        // }
        // if (choice === 'View All Employees'){
        //     showEmployees();
        // }
        // if (choice === 'Add a Department'){
        //     addDept();
        // }
        // if (choice === 'Add a Role'){
        //     addRole();
        // }
        // if (choice === 'Add an Employee'){
        //     addEmployee();
        // }
        // if (choice === 'Update an employee role'){
        //     updateRole();
        // }
    })
}

showDept = () =>{
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
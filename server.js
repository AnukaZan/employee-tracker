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

//prompt user with options
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

        //Show Tables based on Choice
    ]).then((answers) => {     
        const choice = answers.choices;
        
        if (choice === 'View All Departments'){
            console.log('All Departments:');
            showDept();
            return;
        }
        if (choice === 'View All Roles'){
            showRoles();
        }
        if (choice === 'View All Employees'){
            showEmployees();
        }
        if (choice === 'Add a Department'){
            addDept();
        }
        if (choice === 'Add a Role'){
            addRole();
        }
        if (choice === 'Add an Employee'){
            addEmployee();
        }
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

showRoles = ()=>{
    const sql = `SELECT role.id, role.title, department.name AS department FROM role
    INNER JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log('SHOWING ROLES:')
        console.table(rows);
        promptUser();
    });
};

showEmployees = ()=>{
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
    role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

addDept = () => {

    //ASK what name department they want to add
    inquirer.prompt([
        {
            type: 'input',
            name: 'addingDept',
            message: 'What is the name of the department?',
        }
        //Show update based on input
    ]).then((answers) => {     
        const params = answers.addingDept;
        
        const sql = `INSERT INTO department (name) VALUES (?)`;

        db.query(sql, params, (err, rows) => {
            if (err) throw err;
            console.log(`Added ${params} to the department database`)
            promptUser();
        });
    })
    
}

addRole = () => {

    //ASK what name role they want to add
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        } 
    ])
    .then((answers) => {      //need to get the updated list of roles from sql, so will make that list after the promise
        const roleSQL = `SELECT id, name FROM department`;

        db.query(roleSQL, (err, result) => {
            if (err) throw err;

            //map the query from department id and name into id and name
            const depts = result.map(({ id, name }) => ({ value: id, name: name}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is the role in?',
                    choices: depts
                }
            ]).then(response => {
                const params = [answers.roleTitle, answers.salary, response.dept];

                const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;

                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.roleTitle} to roles`);
                    showRoles();

                    promptUser();
                })
            })
        });
    })
}


addEmployee = () => {

    //ASK what the first name, last name
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
        } 
    ])
    .then((answers) => {    
        //prepare SQL to show list of roles
        const roleSQL = `SELECT id, title FROM role`;

        db.query(roleSQL, (err, result) => {
            if (err) throw err;

            //map the query from roles id and name into id and name
            const roles = result.map(({ id, title }) => ({ value: id, name: title}));

            //Ask employee role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What will the role of the employee be?',
                    choices: roles
                }
            ]).then(response => {
                //prepare Employee list to show in inquiry
                const managerSQL = `SELECT id, first_name, last_name FROM employee`;

                db.query(managerSQL, (err, result) => {
                    if (err) throw err;
        
                    //map the query from employees
                    const managersList = result.map(({ id, first_name, last_name }) => ({ value: id, name: first_name + " " + last_name}));
        
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the manager of the employee?',
                            choices: managersList
                        }
                    ]).then(managerChoice => {
                        const params = [answers.first_name, answers.last_name, response.role, managerChoice.manager];
        
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUE (?,?,?,?)`

                        db.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log("Employee has been added");
                            showEmployees();
                        })
                    })
                })
            })
        });
    })
}

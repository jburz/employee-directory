//required packages
require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

//connect to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "employee_directorydb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("=====================================================================================================================================");
    console.log("=        ===================  ====================================      =============================================================");
    console.log("=  =========================  ===================================   ==   ============================================================");
    console.log("=  =========================  ===================================  ====  ========================================  ==================");
    console.log("=  ========  =  = ===    ===  ===   ===  =  ===   ====   ========  =========   ===  = ====   ===  =   ====   ===    ===   ===  =   ==");
    console.log("=      ====        ==  =  ==  ==     ==  =  ==  =  ==  =  =======  ========  =  ==     ==  =  ==    =  ==  =  ===  ===     ==    =  =");
    console.log("=  ========  =  =  ==  =  ==  ==  =  ===    ==     ==     =======  ===   ==     ==  =  ==     ==  ==========  ===  ===  =  ==  ======");
    console.log("=  ========  =  =  ==    ===  ==  =  =====  ==  =====  ==========  ====  ==  =====  =  ==  =====  ========    ===  ===  =  ==  ======");
    console.log("=  ========  =  =  ==  =====  ==  =  ==  =  ==  =  ==  =  =======   ==   ==  =  ==  =  ==  =  ==  =======  =  ===  ===  =  ==  ======");
    console.log("=        ==  =  =  ==  =====  ===   ====   ====   ====   =========      ====   ===  =  ===   ===  ========    ===   ===   ===  ======");
    console.log("=====================================================================================================================================");
    start();
});

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Please select an option from the list:",
                name: "mainMenu",
                choices: [
                    "View All Employees",
                    "View Employees By Department",
                    "View Employees By Manager",
                    "Add Department",
                    "Add Role",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "Exit"
                ]
            }
        ]).then(function (data) {
            switch (data.mainMenu) {
                case "View All Employees":
                    viewAll();
                    break;

                case "View Employees By Department":
                    viewByDept();
                    break;

                case "View Employees By Manager":
                    viewByMgr();
                    break;

                case "Add Department":
                    addDept();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;

                case "Update Employee Manager":
                    updateMgr();
                    break;

                case "Exit":
                    console.log('Goodbye');
                    connection.end();

            }
        });
}

function viewAll() {
    connection.query("SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(Manager.first_name, \" \", Manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id ORDER BY ID;", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------------------------------------------------------------------------------------------");
        start();
    })
}

function viewByDept() {
    connection.query("SELECT department.name AS Departments FROM department JOIN role ON department.id=role.department_id GROUP BY Departments ORDER BY Departments;", function (err, res) {
        if (err) throw err;
        const depts = res.map(function (depts) {
            return depts.Departments;
        });
        inquirer.prompt([
            {
                type: 'list',
                message: 'Which department would you like to view?',
                name: 'viewDept',
                choices: depts
            }
        ]).then(function (data) {
            connection.query('SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id WHERE department.name=? ORDER BY ID;', [data.viewDept], function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("-----------------------------------------------------------------------------------------------------------");
                start();
            });
        });
    });
}

function viewByMgr() {
    connection.query('SELECT employee.manager_id, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager FROM employee JOIN employee AS Manager ON employee.manager_id=Manager.id GROUP BY Manager ORDER BY Manager;', function (err, res) {
        if (err) throw err;
        const mgrRes = res;
        const mgrs = mgrRes.map((mgrs) => {
            return mgrs.Manager;
        });
        inquirer.prompt([
            {
                type: 'list',
                message: 'Which manager would you like to view?',
                name: 'viewMgrs',
                choices: mgrs
            }
        ]).then(function (data) {
            const currentMgr = mgrRes.filter(mgr => mgr.Manager === data.viewMgrs);
            connection.query('SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id WHERE manager.id=? ORDER BY ID;', [currentMgr[0].manager_id], function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("-----------------------------------------------------------------------------------------------------------");
                start();
            })
        });
    });
}

function addEmployee() {
    let newEmpArr = [];
    connection.query('SELECT * FROM role ORDER BY title', function (err, res) {
        if (err) throw err;
        const roles = res.map(function (roles) {
            return roles.title;
        });
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the employees first name?',
                    name: 'newFirstName'
                },
                {
                    type: 'input',
                    message: 'What is the employees last name?',
                    name: 'newLastName'
                },
                {
                    type: 'list',
                    message: 'What is their role?',
                    name: 'newRole',
                    choices: roles
                }
            ]).then(function (data) {
                const newEmp = res.filter(role => role.title === data.newRole);
                newEmpArr.push(data);
                newEmpArr[0].role_id = newEmp[0].id;
                connection.query('SELECT employee.manager_id, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager FROM employee JOIN employee AS Manager ON employee.manager_id=Manager.id GROUP BY Manager ORDER BY Manager;', function (err, res) {
                    if (err) throw err;
                    const mgrRes = res;
                    const mgrs = mgrRes.map((mgrs) => {
                        return mgrs.Manager;
                    });
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'Who is their manager?',
                                name: 'newEmpMgr',
                                choices: mgrs
                            }
                        ]).then(function (data) {
                            const currentMgr = mgrRes.filter(mgr => mgr.Manager === data.newEmpMgr);
                            newEmpArr[0].manager_id = currentMgr[0].manager_id;
                            console.log(newEmpArr);
                            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [newEmpArr[0].newFirstName, newEmpArr[0].newLastName, newEmpArr[0].role_id, newEmpArr[0].manager_id], function (err, res) {
                                if (err) throw err;
                                console.log('Employee added successfully!');
                            });
                            start();
                        });
                });
            });
    });
}

function removeEmployee() {
    console.log('remove employee');
    console.log('restart');
    start();
}

function updateRole() {
    connection.query('SELECT id, concat(first_name, " ", last_name) AS fullName FROM employee ORDER BY first_name;', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    name: 'employee',
                    choices: res.map((emp) => emp.fullName)
                }
            ]).then(function (data) {
                let currentEmp = res.filter(id => id.fullName === data.employee);
                connection.query('SELECT * FROM role ORDER BY title', function (err, res) {
                    if (err) throw err;
                    const roles = res.map(function (roles) {
                        return roles.title;
                    });
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'Please choose a new role:',
                                name: 'newRole',
                                choices: roles
                            }
                        ]).then(function (data) {
                            currentRole = res.filter(id => id.title === data.newRole);
                            console.log(currentRole);
                            console.log('employee id: ' + currentEmp[0].id);
                            console.log('role id: ' + currentRole[0].id);
                            connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [currentRole[0].id, currentEmp[0].id], function (err, res) {
                                if (err) throw err;
                                console.log('Success!');
                            });
                            start();
                        });
                });
            });
    })
}

function updateMgr() {
    console.log('update manager');
    console.log('restart');
    start();
}

function addDept() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department you want to create?',
                name: 'newDept'
            }
        ]).then(function (data) {
            connection.query("INSERT INTO department (name) VALUES (?);", [data.newDept], function (err, res) {
                if (err) throw err;
                console.log(data.newDept + ' has been added to Departments.');
                start();

            })
        })
}

function addRole() {
    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the name of the role you want to create?',
                    name: 'newRole'
                },
                {
                    type: 'input',
                    message: 'What is the salary for this role?',
                    name: 'newSalary'
                },
                {
                    type: 'list',
                    message: 'What department is this role in?',
                    name: 'dept',
                    choices: res.map(dept => dept.name)
                }
            ]).then(function (data) {
                console.log(data);
                // connection.query("INSERT INTO role (title, salary, department_id) VALUES (?)",[data.newRole, data.newSalary],function(err, res) {
                //     if (err) throw err;
                //     console.log(data.newDept + ' has been added to Departments.');
                //     start();

                // });
            });
    });
}
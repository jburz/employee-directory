//required packages
const env = require('dotenv').config();
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
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "Exit"
                ]
            }
        ]).then(function (data) {
            if (data.mainMenu === "View All Employees") {
                viewAll();
            }
            else if (data.mainMenu === "View Employees By Department") {
                viewByDept();
            }
            else if (data.mainMenu === "View Employees By Manager") {
                viewByMgr();
            }
            else if (data.mainMenu === "Add Employee") {
                addEmployee();
            }
            else if (data.mainMenu === "Remove Employee") {
                removeEmployee();
            }
            else if (data.mainMenu === "Update Employee Role") {
                updateRole();
            }
            else if (data.mainMenu === "Update Employee Manager") {
                updateMgr();
            }
            else if (data.mainMenu === "Exit") {
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
                type: 'input',
                message: 'What is their role?',
                name: 'newRole'
            },
            {
                type: 'input',
                message: 'Who is their manager?',
                name: 'newEmpMgr'
            },
        ]).then(function (data) {
            console.log(data);
            start();
        });
}

function removeEmployee() {
    console.log('remove employee');
    console.log('restart');
    start();
}

function updateRole() {
    console.log('udate role');
    console.log('restart');
    start();
}

function updateMgr() {
    console.log('update manager');
    console.log('restart');
    start();
}
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
    console.log('Employee Directory');

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
                    "View All Employees By Department",
                    "View All Employees By Manager",
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
            else if (data.mainMenu === "View All Employees By Department") {
                viewAllByDept();
            }
            else if (data.mainMenu === "View All Employees By Manager") {
                viewAllByMgr();
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
        start();
    })
}

function viewAllByDept() {
    connection.query("SELECT department.name AS Departments FROM department JOIN role ON department.id=role.department_id GROUP BY Departments ORDER BY Departments;", function (err, res) {
        if (err) throw err;
        const depts = res.map(function (test) {
            return test.Departments;
        });
        inquirer.prompt([
            {
                type: 'list',
                message: 'Which department would you like to view?',
                name: 'viewDept',
                choices: depts
            }
        ]).then(function (data) {
            connection.query("SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(Manager.first_name, \" \", Manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id WHERE department.name=? ORDER BY ID;", [data.viewDept], function (err, res) {
                if (err) throw err;
                console.log(res);
                console.table(res);
                start();
            })
        });
    });
}

function viewAllByMgr() {
    connection.query("SELECT department.name AS Departments FROM department JOIN role ON department.id=role.department_id GROUP BY Departments ORDER BY Departments;", function (err, res) {
        if (err) throw err;
        const depts = res.map(function (test) {
            return test.Departments;
        });
        inquirer.prompt([
            {
                type: 'list',
                message: 'Which department would you like to view?',
                name: 'viewDept',
                choices: depts
            }
        ]).then(function (data) {
            connection.query("SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(Manager.first_name, \" \", Manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id WHERE department.name=? ORDER BY ID;", [data.viewDept], function (err, res) {
                if (err) throw err;
                console.log(res);
                console.table(res);
                start();
            })
        });
    });
}

function addEmployee() {

}

function removeEmployee() {

}

function updateRole() {

}

function updateMgr() {

}
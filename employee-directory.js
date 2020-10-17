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

    console.log('==================================================================================================================================');
    console.log('=        ===================  ===================================       ==========================================================');
    console.log('=  =========================  ===================================  ====  =========================================================');
    console.log('=  =========================  ===================================  ====  ==============================  =========================');
    console.log('=  ========  =  = ===    ===  ===   ===  =  ===   ====   ========  ====  ==  ==  =   ====   ====   ===    ===   ===  =   ===  =  =');
    console.log('=      ====        ==  =  ==  ==     ==  =  ==  =  ==  =  =======  ====  ======    =  ==  =  ==  =  ===  ===     ==    =  ==  =  =');
    console.log('=  ========  =  =  ==  =  ==  ==  =  ===    ==     ==     =======  ====  ==  ==  =======     ==  ======  ===  =  ==  ========    =');
    console.log('=  ========  =  =  ==    ===  ==  =  =====  ==  =====  ==========  ====  ==  ==  =======  =====  ======  ===  =  ==  ==========  =');
    console.log('=  ========  =  =  ==  =====  ==  =  ==  =  ==  =  ==  =  =======  ====  ==  ==  =======  =  ==  =  ===  ===  =  ==  =======  =  =');
    console.log('=        ==  =  =  ==  =====  ===   ====   ====   ====   ========       ===  ==  ========   ====   ====   ===   ===  ========   ==');
    console.log('==================================================================================================================================');

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
                    "View",
                    "Add",
                    "Update",
                    "Remove",
                    "Exit"
                ]
            }
        ]).then(function (data) {
            switch (data.mainMenu) {
                case "View":
                    view();
                    break;

                case "Add":
                    add();
                    break;

                case "Update":
                    update();
                    break;

                case "Remove":
                    remove();
                    break;

                case "Exit":
                    console.log('Goodbye');
                    connection.end();

            }
        });
}

function view() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to view?",
                name: "view",
                choices: [
                    "All Employees",
                    "Employees By Department",
                    "Employees By Manager",
                    "Departments",
                    "Roles",
                    "Budget",
                    "Back"
                ]
            }
        ]).then(function (data) {
            switch (data.view) {
                case "All Employees":
                    viewAll();
                    break;

                case "Employees By Department":
                    viewByDept();
                    break;

                case "Employees By Manager":
                    viewByMgr();
                    break;

                case "Departments":
                    viewDepts();
                    break;

                case "Roles":
                    viewRoles();
                    break;

                case "Budget":
                    viewBudget();
                    break;

                case "Back":
                    start();
                    break;
            }
        });
}

function add() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to add?",
                name: "add",
                choices: [
                    "Department",
                    "Employee",
                    "Role",
                    "Back"
                ]
            }
        ]).then(function (data) {
            switch (data.add) {
                case "Department":
                    addDept();
                    break;

                case "Employee":
                    addEmployee();
                    break;

                case "Role":
                    addRole();
                    break;

                case "Back":
                    start();
                    break;
            }
        });
}

function update() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to update?",
                name: "update",
                choices: [
                    "Employee Role",
                    "Employee Manager",
                    "Back"
                ]
            }
        ]).then(function (data) {
            switch (data.update) {

                case "Employee Role":
                    updateRole();
                    break;

                case "Employee Manager":
                    updateMgr();
                    break;

                case "Back":
                    start();
                    break;
            }
        });
}

function remove() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to remove?",
                name: "remove",
                choices: [
                    "Department",
                    "Employee",
                    "Role",
                    "Back"
                ]
            }
        ]).then(function (data) {
            switch (data.remove) {
                case "Department":
                    removeDept();
                    break;

                case "Employee":
                    removeEmployee();
                    break;

                case "Role":
                    removeRole();
                    break;

                case "Back":
                    start();
                    break;
            }
        });
}

function viewAll() {
    connection.query('SELECT employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id ORDER BY FirstName;', function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------------------------------------------------------------------------------------------");
        view();
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
            connection.query('SELECT employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, role.salary AS Salary, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id WHERE department.name=? ORDER BY FirstName;', [data.viewDept], function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("-----------------------------------------------------------------------------------------------------------");
                view();
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
            connection.query('SELECT employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Position, department.name AS Department, role.salary AS Salary FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS Manager ON employee.manager_id=Manager.id WHERE manager.id=? ORDER BY FirstName;', [currentMgr[0].manager_id], function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("-----------------------------------------------------------------------------------------------------------");
                view();
            })
        });
    });
}

function viewDepts() {
    connection.query('SELECT name FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------------------------------------------------------------------------------------------");
        view();
    });
}

function viewRoles() {
    connection.query('SELECT role.title, role.salary, department.name FROM role JOIN department on role.department_id WHERE role.department_id = department.id;', function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------------------------------------------------------------------------------------------");
        view();
    });
}

function viewBudget() {
    connection.query('SELECT department.name AS Department, sum(role.salary) AS Budget FROM role JOIN department ON role.department_id WHERE role.department_id = department.id GROUP BY Department ORDER BY Budget;', function (err, res) {
        if (err) throw err;
        console.table(res);
        view();
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
                            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [newEmpArr[0].newFirstName, newEmpArr[0].newLastName, newEmpArr[0].role_id, newEmpArr[0].manager_id], function (err, res) {
                                if (err) throw err;
                                console.log('Employee added successfully!');
                            });
                            add();
                        });
                });
            });
    });
}

function addRole() {
    connection.query("SELECT * FROM department ORDER BY name;", function (err, res) {
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
                const currentDept = res.filter(dept => dept.name === data.dept);
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [data.newRole, data.newSalary, currentDept[0].id], function (err, res) {
                    if (err) throw err;
                    console.log(data.newRole + ' has been added to ' + data.dept + ' with a salary of ' + data.newSalary + '.');
                    add();
                });
            });
    });
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
                add();

            })
        })
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
                            connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [currentRole[0].id, currentEmp[0].id], function (err, res) {
                                if (err) throw err;
                                console.log('Success!');
                            });
                            update();
                        });
                });
            });
    });
}

function updateMgr() {
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
                connection.query('SELECT employee.manager_id, CONCAT(Manager.first_name, " ", Manager.last_name) AS Manager FROM employee JOIN employee AS Manager ON employee.manager_id=Manager.id GROUP BY Manager ORDER BY Manager;', function (err, res) {
                    if (err) throw err;
                    const mgrs = res.map(mgr => mgr.Manager);
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'Please choose a new manager:',
                                name: 'newMgr',
                                choices: mgrs
                            }
                        ]).then(function (data) {
                            currentMgr = res.filter(id => id.Manager === data.newMgr);
                            connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [currentMgr[0].manager_id, currentEmp[0].id], function (err, res) {
                                if (err) throw err;
                                console.log('Success!');
                                update();
                            });
                        });
                });
            });
    });
}

function removeDept() {
    connection.query('SELECT * from department ORDER BY name', function (err, res) {
        if (err) throw err;
        const depts = res.map(dept => dept.name);
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which department would you like to remove?",
                    name: "dept",
                    choices: depts
                }
            ]).then(function (data) {
                const currentDept = res.filter(dept => dept.name === data.dept);
                connection.query("DELETE FROM department WHERE id = ?", [currentDept[0].id], function (err, res) {
                    if (err) {
                        console.log("-----------------------------------------------------------------------------------------------------------");
                        console.log("Please remove all roles from this department before deleting.");
                        console.log("-----------------------------------------------------------------------------------------------------------");
                    }
                    console.log("Deleted!");
                    remove();
                });
            });
    });
}

function removeEmployee() {
    connection.query('SELECT id, concat(first_name, " ", last_name) AS name from employee ORDER BY name', function (err, res) {
        if (err) throw err;
        const employees = res.map(employee => employee.name);
        console.log(employees);
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which employee would you like to remove?",
                    name: "employee",
                    choices: employees
                }
            ]).then(function (data) {
                const currentEmp = res.filter(emp => emp.name === data.employee);
                connection.query("DELETE FROM employee WHERE id = ?", [currentEmp[0].id], function (err, res) {
                    if (err) throw err;
                    console.log("Deleted!");
                    remove();
                });
            });
    });
}

function removeRole() {
    connection.query('SELECT * from role ORDER BY title', function (err, res) {
        if (err) throw err;
        const roles = res.map(role => role.title);
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which role would you like to remove?",
                    name: "role",
                    choices: roles
                }
            ]).then(function (data) {
                const currentRole = res.filter(role => role.title === data.role);
                connection.query("DELETE FROM role WHERE id = ?", [currentRole[0].id], function (err, res) {
                    if (err) {
                        console.log("-----------------------------------------------------------------------------------------------------------");
                        console.log("Please update any employee with this role before deleting.");
                        console.log("-----------------------------------------------------------------------------------------------------------");
                    } else {
                        console.log("Deleted!");
                    }
                    remove();
                });
            });
    });
}




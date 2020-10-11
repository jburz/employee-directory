//required packages
const env = require ('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');

//connect to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "employee_directorydb"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    console.log('Employee Directory');
    connection.query("SELECT department.name AS Departments, sum(role.salary) AS Budget FROM department JOIN role ON department.id=role.department_id GROUP BY Departments;", function(err, res) {
        if (err) throw err;
        console.table(res);
    })
    connection.end();
}
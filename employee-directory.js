//required packages
const env = require ('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');

//connect to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('hit');
    connection.end();
})



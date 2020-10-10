DROP DATABASE IF EXISTS employee_directoryDB;

--create new database
CREATE DATABASE employee_directoryDB;

USE employee_directoryDB;

--create employee table and initialize headers
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL
    PRIMARY KEY (id)
)

--create role table and initialize headers
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    deparment_id INT NOT NULL,
    PRIMARY KEY (id)
)

--create department table and initialize headers
CREATE TABLE deparment (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30)
    PRIMARY KEY (id)
)
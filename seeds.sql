USE employee_directoryDB.department;

-- add departments
INSERT INTO department (name) VALUES ("Human Resources");

-- add roles
INSERT INTO role (title, salary, deparment_id) VALUES ("Director", 100000, 1);

-- add employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jake", "Burzlaff", 1, 1);
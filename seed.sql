USE employee_directorydb;

-- add departments
INSERT INTO department (name) VALUES ("Operations"), ("Finance"), ("Marketing"), ("Engineering");

-- add roles
INSERT INTO role (title, salary, department_id) VALUES ("Chief Operations Officer", 100000, 1), ("Plant Manager", 65000, 1), ("Warehouse Employee", 40000, 1), ("Chief Financial Officer", 120000, 2), ("Controller", 90000, 2), ("Accountant", 70000, 2), ("Chief Marketing Officer", 95000, 3), ("Marketing Manager", 65000, 3), ("Marketing Specialist", 55000, 3), ("Director of Engineering", 100000, 4), ("Mechanical Engineer", 75000, 4), ("Electrical Engineer", 80000, 4);

-- add employees
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Tom", "Hanks", 1), ("Anthony", "Hopkins", 4), ("Jack", "Nicholson", 7), ("Robin", "Williams", 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Robert", "DeNiro", 2, 1), ("Tom", "Cruise", 3, 1), ("Julia", "Roberts", 3, 1), ("Denzel", "Washington", 5, 2), ("Susan", "Sarandon", 6, 2), ("Al", "Pacino", 6, 2), ("Meryl", "Streep", 8, 3), ("Jodie", "Foster", 9, 3), ("Mel", "Gibson", 9, 3), ("Michelle", "Pfeiffer", 11, 4), ("Winona", "Ryder", 11, 4), ("Bruce", "Willis", 12, 4), ("Morgan", "Freeman", 12, 4);

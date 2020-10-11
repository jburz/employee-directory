USE employee_directorydb;

-- add departments
INSERT INTO department (name) VALUES ("Operations"), ("Finance"), ("Marketing"), ("Engineering");

-- add roles
INSERT INTO role (title, salary, department_id) VALUES ("Chief Operations Officer", 100000, 1), ("Plant Manager", 65000, 1), ("Warehouse Employee", 40000, 1), ("Chief Financial Officer", 120000, 2), ("Controller", 90000, 2), ("Accountant", 70000, 2), ("Chief Marketing Officer", 95000, 3), ("Marketing Manager", 65000, 3), ("Marketing Specialist", 55000, 3), ("Director of Engineering", 100000, 4), ("Mechanical Engineer", 75000, 4), ("Electrical Engineer", 80000, 4);

-- add employees
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Tom", "Hanks", 1), ("Anthony", "Hopkins", 4), ("Jack", "Nicholson", 7), ("Robin", "Williams", 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Robert", "DeNiro", 2, 1), ("Tom", "Cruise", 3, 2), ("Julia", "Roberts", 3, 2), ("Denzel", "Washington", 5, 4), ("Susan", "Sarandon", 6, 5), ("Al", "Pacino", 6, 5), ("Meryl", "Streep", 8, 7), ("Jodie", "Foster", 9, 8), ("Mel", "Gibson", 9, 8), ("Michelle", "Pfeiffer", 11, 10), ("Winona", "Ryder", 11, 10), ("Bruce", "Willis", 12, 10), ("Morgan", "Freeman", 12, 10);

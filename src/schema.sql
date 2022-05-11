DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
	id INT AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	PRIMARY KEY(id)
);

CREATE TABLE employee_role(
	id INT AUTO_INCREMENT,
	title VARCHAR(32) NOT NULL UNIQUE,
	salary DECIMAL,
	department_id INT,
	PRIMARY KEY(id),
	FOREIGN KEY (department_id) REFERENCES department(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE employee(
	id INT AUTO_INCREMENT,
	first_name VARCHAR(32),
	last_name VARCHAR(32),
	role_id INT,
	manager_id INT,
	PRIMARY KEY (id),
	FOREIGN KEY (role_id) REFERENCES employee_role(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (manager_id) REFERENCES employee(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP USER IF EXISTS 'employee_cms'@'localhost';

CREATE USER 'employee_cms'@'localhost' IDENTIFIED BY 'password';

GRANT ALL ON employee_db.* TO 'employee_cms'@'localhost';
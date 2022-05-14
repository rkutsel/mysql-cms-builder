"use strict";

async function createConnectionPool() {
	const mysql = require("mysql2/promise");
	const bluebird = require("bluebird");

	const pool = mysql.createPool({
		host: "localhost",
		user: "employee_cms",
		password: "password",
		database: "employee_db",
		waitForConnections: true,
		connectionLimit: 10,
		Promise: bluebird,
	});

	return pool;
}

async function sqlRenderedSelect(select, consoleLog) {
	const promisePool = await createConnectionPool();
	const response = await promisePool.query(select).then((rows) => {
		if (consoleLog) {
			console.table(rows[0]);
			promisePool.end();
		} else {
			promisePool.end();
			return rows[0];
		}
	});
	return response;
}

async function sqlPreparedSelect(select, arg, consoleLog) {
	const promisePool = await createConnectionPool();
	const response = await promisePool.query(select, arg).then((rows) => {
		if (consoleLog) {
			console.table(rows[0]);
			promisePool.end();
		} else {
			promisePool.end();
			return rows[0];
		}
	});
	return response;
}

async function sqlInsert(insert, arg) {
	const promisePool = await createConnectionPool();
	await promisePool.execute(insert, arg).then(() => promisePool.end());
}

async function addDepartment(name) {
	const promisePool = await createConnectionPool();
	await promisePool
		.execute(
			`INSERT INTO department (name) VALUES 
  (?)`,
			[name.toUpperCase()]
		)
		.then(() => promisePool.end());
}

async function addRole(title, salary, department_id) {
	const promisePool = await createConnectionPool();
	await promisePool
		.execute(
			`INSERT INTO employee_role (title, salary, department_id) VALUES 
  (?,?,?)`,
			[title.toUpperCase(), parseInt(salary), parseInt(department_id)]
		)
		.then(() => promisePool.end());
}

module.exports.sqlRenderedSelect = sqlRenderedSelect;
module.exports.sqlPreparedSelect = sqlPreparedSelect;
module.exports.sqlInsert = sqlInsert;
module.exports.addDepartment = addDepartment;
module.exports.addRole = addRole;

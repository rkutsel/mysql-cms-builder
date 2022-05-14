const inquirer = require("inquirer");
const {
	sqlRenderedSelect,
	sqlPreparedSelect,
	sqlInsert,
} = require("./queries");
const { questions } = require("./questions");

class Employee {
	constructor(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}
	getAllEmployees() {
		const select = `SELECT e.first_name AS FirstName, e.last_name as LastName, r.title AS Role, CONCAT (m.first_name, " ", m.last_name) AS Manager FROM employee AS e INNER JOIN employee_role AS r ON r.id = e.role_id INNER JOIN employee AS m ON m.id = e.manager_id ORDER BY m.first_name`;
		const consoleLog = true;
		sqlRenderedSelect(select, consoleLog);
	}

	async addEmployee(firstName, lastName, roleId, manager) {
		const insert =
			"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
		const insertArg = [firstName, lastName, roleId, manager];
		const response = await sqlInsert(insert, insertArg);
		console.log("\x1b[36m", `New employee has been added!`);
		return response;
	}

	async updateEmployeeRole(roleTitle, employeeRoleId) {
		const id = await roleId();
		const update = `UPDATE employee SET role_id = ? WHERE id = ?;`;
		const updateArg = [id, employeeRoleId];
		const response = await sqlInsert(update, updateArg);
		console.log("Employee Role Updated!");
		async function roleId() {
			const select = `SELECT id FROM employee_role WHERE title = ?;`;
			const selectArg = roleTitle;
			const roleId = await sqlPreparedSelect(select, selectArg);
			return roleId[0].id;
		}
	}

	async selectEmployee(answer) {
		const { managerName } = answer;
		console.log(managerName);
		const selectId = `SELECT id FROM employee WHERE first_name = ? && last_name = ?;`;
		const selectArg = [managerName.split(" ")[0], managerName.split(" ")[1]];
		const managerId = await sqlPreparedSelect(selectId, selectArg);
		return managerId;
	}
}

module.exports = Employee;

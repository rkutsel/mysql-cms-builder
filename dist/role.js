const inquirer = require("inquirer");
const { sqlRenderedSelect, sqlPreparedSelect, addRole } = require("./queries");
const { questions } = require("./questions");
const Database = require("./database");
const dbConn = new Database();

class Role {
	constructor(title, salary, id) {
		this.title = title;
		this.salary = salary;
		this.id = id;
		this.roleID = () => this;
	}
	selectRoles() {
		const select = `SELECT e.title AS Role, e.salary as Salary, d.name AS Department FROM employee_role AS e INNER JOIN department as d ON e.department_id=d.id ORDER BY title`;
		const consoleLog = true;
		sqlRenderedSelect(select, consoleLog);
	}
	addRole() {
		addRole(this.title, this.salary, this.id).then((data) =>
			console.table(data)
		);
	}

	async getRoles() {
		const select = "SELECT title, id FROM employee_role";
		const roles = await dbConn.dbRenderedSelect(select);
		return roles;
	}

	async getRoleId() {
		const select = "SELECT id FROM employee_role";
		const roles = await dbConn.dbRenderedSelect(select);
		return roles;
	}

	async chooseRoles(list) {
		const question = questions.chooseRole;
		question[0].choices = list;
		inquirer.prompt(question).then((answer) => {
			const { roleName } = answer;
			return roleName;
		});
	}

	async updateRole(title, salary, roleName) {
		const select = `SELECT id FROM department WHERE name = ?`;
		const arg = roleName.toUpperCase();
		const deptId = await sqlPreparedSelect(select, arg);
		await addRole(title, salary, deptId[0].id);
		console.log(
			"\x1b[36m",
			`New Entry:\n Title: ${title}\n Salary: ${salary}\n DepartmentID: ${deptId}\n has been added!`
		);
	}
}

module.exports = Role;

const { sqlRenderedSelect, addDepartment } = require("./queries");
const { questions } = require("./questions");

class Department {
	constructor(name) {
		this.name = name;
	}
	async selectDepartments() {
		const select = "SELECT name FROM department ORDER BY name";
		const consoleLog = true;
		await sqlRenderedSelect(select, consoleLog);
	}
	addDepartment(answer) {
		addDepartment(answer).then((data) => console.table(data));
	}
	async chooseDepartment(title, salary) {
		const selectDepartment = `SELECT name FROM department`;
		const departmentId = await sqlRenderedSelect(selectDepartment);
		const question = questions.chooseDepartment;
		const roleName = await renderedAnswer(
			departmentId,
			title,
			salary,
			question
		);
	}
}

module.exports = Department;

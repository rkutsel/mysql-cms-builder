const inquirer = require("inquirer");
const {
	initialQuestions,
	addDepartment,
	addRole,
	mainMenu,
} = require("./dist/questions");
const Employee = require("./dist/employee");
const Role = require("./dist/role");
const Department = require("./dist/department");

function manageDepartment(answer) {
	if (answer === "view all departments") {
		const select = "SELECT * FROM department ORDER BY name";
		const consoleLog = true;
		const newDepartment = new Department();
		newDepartment.selectDepartments(select, consoleLog);
		setTimeout(returnToMainMenu, 250);
	} else {
		inquirer.prompt(addDepartment).then((answer) => {
			const { addDepartment } = answer;
			const newDepartment = new Department(addDepartment);
			newDepartment.addDepartment();
			console.log(`Department name "${addDepartment}" created!\n`);
			returnToMainMenu();
		});
	}
}

function manageRole(answer) {
	if (answer === "view all roles") {
		const select = "SELECT * FROM employee_role ORDER BY title";
		const consoleLog = true;
		const newRole = new Role();
		newRole.selectRoles(select, consoleLog);
		setTimeout(returnToMainMenu, 250);
	} else {
		inquirer.prompt(addRole).then((answer) => {
			const { roleTitle, roleSalary } = answer;
			chooseDepartment(roleTitle, roleSalary);
			// const newRole = new Role(roleTitle, roleSalary);
			// newRole.addRole();
			// console.log(`Role name "${roleTitle}" created!\n`);
			// returnToMainMenu();
		});
	}
}

async function chooseDepartment(title, salary) {
	// selectDepartments().then((data) => console.log(data));
	const select = "SELECT * FROM department ORDER BY name";
	const consoleLog = false;
	const newDepartment = new Department();
	console.log(
		await newDepartment
			.selectDepartments(select, consoleLog)
			.then((data) => data)
	);
	// console.log(typeof selectQuery().then((data) => data));
	// await selectQuery.forEach((element) => {
	// 	console.log(element);
	// });
}

function initialPrompt() {
	inquirer.prompt(initialQuestions).then((answer) => {
		const { initialQuestion } = answer;
		if (
			initialQuestion === "view all departments" ||
			initialQuestion === "add a department"
		) {
			manageDepartment(initialQuestion);
		} else if (
			initialQuestion === "view all roles" ||
			initialQuestion === "add a role"
		) {
			manageRole(initialQuestion);
		} else if (
			initialQuestion === "view all employees" ||
			initialQuestion === "add a employee" ||
			initialQuestion === "update an employee role"
		) {
			manageEmployee(initialQuestion);
		} else {
			consoleLogCanceled();
		}
	});
}

function consoleLogCanceled() {
	console.log(
		"Canceled! You can try again by running `node index` in your terminal."
	);
}

function returnToMainMenu() {
	inquirer.prompt(mainMenu).then((answer) => {
		if (answer.mainMenu) {
			initialPrompt();
		} else {
			consoleLogCanceled();
		}
	});
}

function init() {
	initialPrompt();
}

init();

const inquirer = require("inquirer");
const { questions } = require("./dist/questions");
const Employee = require("./dist/employee");
const Role = require("./dist/role");
const Department = require("./dist/department");
const Database = require("./dist/database");

function manageDepartment(answer) {
	if (answer === "view all departments") {
		const select = "SELECT * FROM department ORDER BY name";
		const consoleLog = true;
		const newDepartment = new Department();
		newDepartment.selectDepartments(select, consoleLog);
		setTimeout(returnToMainMenu, 250);
	} else {
		inquirer.prompt(questions.addDepartment).then((answer) => {
			const { addDepartment } = answer;
			const newDepartment = new Department(addDepartment);
			newDepartment.addDepartment();
			console.log("\x1b[36m", `Department name "${addDepartment}" created!\n`);
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
		inquirer.prompt(questions.addRole).then((answer) => {
			const { roleTitle, roleSalary } = answer;
			chooseDepartment(roleTitle, roleSalary);
		});
	}
}

async function chooseDepartment(title, salary) {
	const selectDepartment = `SELECT name FROM department`;
	const departmentId = await renderedSelect(selectDepartment);
	const question = questions.chooseDepartment;
	const roleName = await renderedAnswer(departmentId, title, salary, question);
}

async function updateRole(title, salary, roleName) {
	const select = `SELECT id FROM department WHERE name = ?`;
	const arg = roleName.toUpperCase();
	const deptId = await preparedSelect(select, arg);
	setTimeout(() => {
		const newRole = new Role(title, salary, deptId);
		newRole.addRole();
		console.log(
			"\x1b[36m",
			`New Entry:\n Title: ${title}\n Salary: ${salary}\n DepartmentID: ${deptId}\n has been added!`
		);
		returnToMainMenu();
	}, 250);
}

function manageEmployee(answer) {
	if (answer === "view all employees") {
		const select = `SELECT e.first_name AS FirstName, e.last_name AS LastName, e.role_id AS Role, e.manager_id AS Manager FROM employee e INNER JOIN employee_role r ON e.role_id = r.id LIMIT 20`;
	} else if (answer === "add an employee") {
		inquirer.prompt(questions.addEmployee).then((answer) => {
			const { firstName, lastName } = answer;
			chooseRole(firstName, lastName);
		});
	} else {
		selectEmployee();
	}
}

async function chooseRole(firstName, lastName) {
	const select = "SELECT title FROM employee_role";
	const roleId = await renderedSelect(select);
	const question = questions.chooseRole;
	const roleName = await renderedAnswer(roleId, firstName, lastName, question);
}

async function chooseManager(firstName, lastName, roleName) {
	inquirer.prompt(questions.addManager).then((answer) => {
		const { addManager } = answer;
		if (addManager) {
			chooseManager(firstName, lastName, roleName);
		} else {
			manager = false;
			addEmployee(firstName, lastName, roleName, manager);
		}
	});
}

async function chooseManager(firstName, lastName, roleName) {
	const selectName = "SELECT first_name, last_name FROM employee";
	const employeeList = await renderedSelect(selectName);
	const question = questions.chooseManager;
	const getEmployees = async (employeeList) => {
		let choices = [];
		const choice = await employeeList.forEach((element) => {
			choices.push(element.join(" "));
		});
		question[0].choices = choices;
		inquirer
			.prompt(questions.chooseManager)
			.then((answer) => {
				const newEmployee = new Employee();
				const managerId = newEmployee.selectEmployee(answer);
				return managerId;
			})
			.then((managerId) => {
				addEmployee(firstName, lastName, roleName, managerId[0].id);
			});
	};
	await getEmployees(employeeList);
}

async function selectEmployee() {
	const questionName = questions.Employee;
	const employeeList = await selectEmployee(questionName);
	// const selectName = "SELECT first_name, last_name FROM employee";
	// const employeeList = await renderedSelect(selectName);
	// const question = questions.Employee;
	const getEmployees = async (employeeList) => {
		let choices = [];
		const choice = await employeeList.forEach((element) => {
			choices.push(element.join(" "));
		});
		question[0].choices = choices;
		inquirer
			.prompt(questions.chooseManager)
			.then((answer) => {
				const newEmployee = new Employee();
				const managerId = newEmployee.selectEmployee(answer);
				return managerId;
			})
			.then((managerId) => {
				updateEmployee(firstName, lastName, roleName, managerId[0].id);
			});
	};
	await getEmployees(employeeList);
}

async function addEmployee(firstName, lastName, roleName, manager) {
	if (manager) {
		const roleId = await getRoleId(roleName);
		const insert =
			"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
		const insertArg = [firstName, lastName, roleId, manager];
		const newDbConn = new Database();
		const query = await newDbConn.dbInsert(insert, insertArg);
	} else {
		const roleId = await getRoleId(roleName);
		const insert =
			"INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)";
		const insertArg = [firstName, lastName, roleId];
		const newDbConn = new Database();
		const query = await newDbConn.dbInsert(insert, insertArg);
	}
	initialPrompt();
}

function initialPrompt() {
	inquirer.prompt(questions.initialQuestions).then((answer) => {
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
			initialQuestion === "add an employee" ||
			initialQuestion === "update an employee role"
		) {
			manageEmployee(initialQuestion);
		} else {
			consoleLogCanceled();
		}
	});
}

async function renderedSelect(select) {
	const newDbConn = new Database();
	const response = await newDbConn.dbRenderedSelect(select);
	return response;
}

async function preparedSelect(select, arg) {
	const consoleLog = false;
	const newDbConn = new Database();
	const response = await newDbConn.dbPreparedSelect(select, arg, consoleLog);
	return response;
}

async function selectEmployee(questionName) {
	const selectName = "SELECT first_name, last_name FROM employee";
	const employeeList = await renderedSelect(selectName);
	const question = questionName;
	return employeeList;
}

async function renderedAnswer(id, name, arg, question) {
	question[0].choices = id;
	inquirer.prompt(question).then((answer) => {
		if (question[0].name === "departmentName") {
			const { departmentName } = answer;
			updateRole(name, arg, departmentName);
		} else if (question[0].name === "roleName") {
			const { roleName } = answer;
			chooseManager(name, arg, roleName);
		}
	});
}

async function getRoleId(roleName) {
	const select = `SELECT id FROM employee_role WHERE title = ?`;
	const selectArg = roleName.toUpperCase();
	const roleId = await preparedSelect(select, selectArg);
	return roleId;
}

function consoleLogCanceled() {
	console.log(
		"Canceled! You can try again by running `node index` in your terminal."
	);
}

function returnToMainMenu() {
	inquirer.prompt(questions.mainMenu).then((answer) => {
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

const inquirer = require("inquirer");
const { questions } = require("./dist/questions");
const Employee = require("./dist/employee");
const Role = require("./dist/role");
const Department = require("./dist/department");
const Database = require("./dist/database");

let newEmployee = new Employee();
let newRole = new Role();
let newDepartment = new Department();
let newDatabase = new Database();

function manageDepartment(answer) {
	// const newDepartment = new Department();
	if (answer === "view all departments") {
		newDepartment.selectDepartments();
		setTimeout(returnToMainMenu, 250);
	} else {
		inquirer.prompt(questions.addDepartment).then((answer) => {
			const { addDepartment } = answer;
			newDepartment.addDepartment(addDepartment);
			console.log("\x1b[36m", `Department name "${addDepartment}" created!\n`);
			returnToMainMenu();
		});
	}
}

function manageRole(answer) {
	if (answer === "view all roles") {
		// const newRole = new Role();
		newRole.selectRoles();
		setTimeout(returnToMainMenu, 250);
	} else {
		inquirer.prompt(questions.addRole).then((answer) => {
			const { roleTitle, roleSalary } = answer;
			chooseDepartment(roleTitle, roleSalary);
			// const newDepartment = new Department();
			// const departmentList = newDepartment.chooseDepartment(
			// 	roleTitle,
			// 	roleSalary
			// );
		});
	}
}

async function chooseDepartment(title, salary) {
	const selectDepartment = `SELECT name FROM department`;
	const departmentId = await renderedSelect(selectDepartment);
	const question = questions.chooseDepartment;
	const roleName = await renderedAnswer(departmentId, title, salary, question);
}

// async function updateRole(title, salary, roleName) {
// 	const select = `SELECT id FROM department WHERE name = ?`;
// 	const arg = roleName.toUpperCase();
// 	const deptId = await preparedSelect(select, arg);
// 	setTimeout(() => {
// 		const newRole = new Role(title, salary, deptId);
// 		newRole.addRole();
// 		console.log(
// 			"\x1b[36m",
// 			`New Entry:\n Title: ${title}\n Salary: ${salary}\n DepartmentID: ${deptId}\n has been added!`
// 		);
// 		returnToMainMenu();
// 	}, 250);
// }

function manageEmployee(answer) {
	if (answer === "view all employees") {
		// const newRole = new Employee();
		newEmployee.getAllEmployees();
		setTimeout(returnToMainMenu, 250);
	} else if (answer === "add an employee") {
		inquirer.prompt(questions.addEmployee).then((answer) => {
			const { firstName, lastName } = answer;
			// const newRole = new Role();
			// const roleList = newRole.chooseRole(firstName, lastName);
			chooseRole(firstName, lastName);
		});
	} else {
		updateEmployee(answer);
	}
}

async function chooseRole(firstName, lastName) {
	const select = "SELECT title FROM employee_role";
	const roleId = await renderedSelect(select);
	const question = questions.chooseRole;
	const roleName = await renderedAnswer(roleId, firstName, lastName, question);
}

async function selectManager(firstName, lastName, roleName) {
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
				// const newEmployee = new Employee();
				const managerId = newEmployee.selectEmployee(answer);
				return managerId;
			})
			.then((managerId) => {
				addEmployee(firstName, lastName, roleName, managerId[0].id);
			});
	};
	await getEmployees(employeeList);
}

async function updateEmployee() {
	let employeeRoleId = "";
	const selectName = "SELECT first_name, last_name FROM employee";
	// const newEmployee = new Employee();
	// const newRole = new Role();
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
				const employeeId = newEmployee.selectEmployee(answer);
				return employeeId;
			})
			.then((employeeId) => {
				employeeRoleId = employeeId[0].id;
				const roleNames = newRole.getRoles();
				return roleNames;
			})
			.then((roleNames) => {
				const question = questions.chooseRole;
				question[0].choices = roleNames;
				inquirer.prompt(question).then((answer) => {
					const { roleName } = answer;
					console.log(roleName, employeeRoleId);
				});
			});
	};
	await getEmployees(employeeList);
}

async function addEmployee(firstName, lastName, roleName, manager) {
	// if (manager) {
	const roleId = await getRoleId(roleName);
	const addEmployee = await newEmployee.addEmployee(
		firstName,
		lastName,
		roleId,
		manager
	);
	// const insert =
	// 	"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
	// const insertArg = [firstName, lastName, roleId, manager];
	// const newDbConn = new Database();
	// const query = await newDbConn.dbInsert(insert, insertArg);
	// } else {
	// 	const roleId = await getRoleId(roleName);
	// 	const insert =
	// 		"INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)";
	// 	const insertArg = [firstName, lastName, roleId];
	// 	const newDbConn = new Database();
	// 	const query = await newDbConn.dbInsert(insert, insertArg);
	// }
	initialPrompt();
}

async function renderedSelect(select) {
	// const newDbConn = new Database();
	const response = await newDatabase.dbRenderedSelect(select);
	return response;
}

async function preparedSelect(select, arg) {
	const consoleLog = false;
	// const newDbConn = new Database();
	const response = await newDatabase.dbPreparedSelect(select, arg, consoleLog);
	return response;
}

// async function selectEmployee(questionName) {
// 	const selectName = "SELECT first_name, last_name FROM employee";
// 	const employeeList = await renderedSelect(selectName);
// 	const question = questionName;
// 	return employeeList;
// }

async function renderedAnswer(id, name, arg, question) {
	question[0].choices = id;
	inquirer.prompt(question).then((answer) => {
		if (question[0].name === "departmentName") {
			const { departmentName } = answer;
			// updateRole(name, arg, departmentName);
			// const newRole = new Role();
			newRole.updateRole(name, arg, departmentName);
			setTimeout(returnToMainMenu, 200);
		} else if (question[0].name === "roleName") {
			const { roleName } = answer;
			selectManager(name, arg, roleName);
		}
	});
}

async function getRoleId(roleName) {
	const select = `SELECT id FROM employee_role WHERE title = ?`;
	const selectArg = roleName.toUpperCase();
	const roleId = await preparedSelect(select, selectArg);
	return roleId;
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

function consoleLogCanceled() {
	console.log(
		"Canceled! You can try again by running `node index` in your terminal."
	);
}
// function updateEmployeeRole(){
// 	db.findEmployees().then(([data]) => {
// 		const employeeList = data.map(({id, first_name, last_name})=>({
// 			name: `${first_name} ${last_name}`,
// 			value: id
// 		}))

// 		inquirer.prompt([{
// 			type: 'list',
// 			name: 'employeeList',
// 			message: 'choose an employee',
// 			choices: employeeList
// 		}]).then((res)=>{
// 			const employeeId=res.employeeList

// 		})
// 	})
// }

function initialPrompt() {
	inquirer.prompt(questions.initialQuestions).then((answer) => {
		const { initialQuestion } = answer;
		switch (initialQuestion) {
			case "view all departments":
			case "add a department":
				manageDepartment(initialQuestion);
				break;
			case "view all roles":
			case "add a role":
				manageRole(initialQuestion);
				break;
			case "view all employees":
			case "add an employee":
			case "update an employee role":
				manageEmployee(initialQuestion);
				break;
			default:
				consoleLogCanceled();
		}

		// if (
		// 	initialQuestion === "view all departments" ||
		// 	initialQuestion === "add a department"
		// ) {
		// 	manageDepartment(initialQuestion);
		// } else if (
		// 	initialQuestion === "view all roles" ||
		// 	initialQuestion === "add a role"
		// ) {
		// 	manageRole(initialQuestion);
		// } else if (
		// 	initialQuestion === "view all employees" ||
		// 	initialQuestion === "add an employee" ||
		// 	initialQuestion === "update an employee role"
		// ) {
		// 	manageEmployee(initialQuestion);
		// } else {
		// 	consoleLogCanceled();
		// }
	});
}

function init() {
	initialPrompt();
}

init();

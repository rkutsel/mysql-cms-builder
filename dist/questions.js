const initialQuestions = [
	{
		type: "list",
		name: "initialQuestion",
		message: `
 /$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$$$ /$$$$$$$  /$$   /$$  /$$$$$$  /$$              /$$$$$$  /$$      /$$  /$$$$$$ 
|_  $$_/| $$$ | $$|__  $$__/| $$_____/| $$__  $$| $$$ | $$ /$$__  $$| $$             /$$__  $$| $$$    /$$$ /$$__  $$
  | $$  | $$$$| $$   | $$   | $$      | $$   \ $$| $$$$| $$| $$   \ $$| $$            | $$  \__/ | $$$$  /$$$$| $$  \__/
  | $$  | $$ $$ $$   | $$   | $$$$$   | $$$$$$$/| $$ $$ $$| $$$$$$$$| $$            | $$      | $$ $$/$$ $$|  $$$$$$ 
  | $$  | $$  $$$$   | $$   | $$__/   | $$ __ $$| $$  $$$$| $$__  $$| $$            | $$      | $$  $$$| $$ \____  $$
  | $$  | $$ \  $$$   | $$   | $$      | $$   \ $$|  $$\  $$$| $$  | $$| $$            | $$    $$| $$\  $  | $$ /$$  \ $$
 /$$$$$$| $$  \  $$   | $$   | $$$$$$$$| $$  | $$|  $$ \  $$| $$  | $$| $$$$$$$$      |  $$$$$$/| $$ \/   | $$|  $$$$$$/
|______/|__/   \__/   |__/   |________/|__/  |__/|__/   \__/|__/  |__/|________/       \______/  |__/     |__/ \______/ 
                                                                                                                     
Please choose action type:`,
		choices: [
			"view all departments",
			"view all roles",
			"view all employees",
			"add a department",
			"add a role",
			"add an employee",
			"update an employee role",
			"CANCEL",
		],
		default: "CANCEL",
	},
];

const addDepartment = [
	{
		type: "input",
		name: "addDepartment",
		message: "Enter Department Name You'd Like To Add",
		validate(value) {
			return validateInput(value);
		},
	},
];

const chooseDepartment = [
	{
		type: "list",
		name: "departmentName",
		message: "Associate Role With A Department:",
		choices: [],
	},
];

const addRole = [
	{
		type: "input",
		name: "roleTitle",
		message: "Enter Role Title:",
		validate(value) {
			return validateInput(value);
		},
	},
	{
		type: "input",
		name: "roleSalary",
		message: "Enter Role Salary:",
		validate(value) {
			return validateInput(value);
		},
	},
];

const addEmployee = [
	{
		type: "input",
		name: "firstName",
		message: "Enter First Name:",
		validate(value) {
			return validateInput(value);
		},
	},
	{
		type: "input",
		name: "lastName",
		message: "Enter Last Name:",
		validate(value) {
			return validateInput(value);
		},
	},
];
const updateEmployee = [
	{
		type: "list",
		name: "employeeName",
		message: "Choose Employee From The Lits:",
		choices: [],
	},
];
const chooseRole = [
	{
		type: "list",
		name: "roleName",
		message: "Choose Role:",
		choices: [],
	},
];

const addManager = [
	{
		type: "confirm",
		name: "addManager",
		message: "Would You Like To Choose A Manager:",
	},
];

const chooseManager = [
	{
		type: "list",
		name: "managerName",
		message: "Choose Manager:",
		choices: [],
	},
];

const mainMenu = [
	{
		type: "confirm",
		name: "mainMenu",
		message: "Would you like to return to the main menu?\n\n",
	},
];

function validateInput(value) {
	const pass = value.length > 2;
	if (pass) {
		return true;
	}
	return "Error: Entry cannot be empty. Please try again.";
}

module.exports.questions = {
	initialQuestions,
	addDepartment,
	chooseDepartment,
	addRole,
	addEmployee,
	addManager,
	chooseRole,
	chooseManager,
	mainMenu,
};

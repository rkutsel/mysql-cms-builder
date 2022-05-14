const {
	sqlRenderedSelect,
	sqlPreparedSelect,
	sqlInsert,
} = require("./queries");

class Database {
	async dbRenderedSelect(select) {
		let renderedResponse = [];
		const rawResponse = await sqlRenderedSelect(select);
		rawResponse.forEach((element, index) => {
			if (element.title) {
				renderedResponse.push(element.title);
			} else if (element.name) {
				renderedResponse.push(element.name);
			} else {
				renderedResponse.push([element.first_name, element.last_name]);
			}
		});
		return renderedResponse;
	}
	async dbPreparedSelect(select, arg, consoleLog) {
		const rawResponse = await sqlPreparedSelect(select, arg, consoleLog);
		const renderedResponse = rawResponse[0].id;
		return renderedResponse;
	}
	async dbInsert(insert, arg) {
		const response = await sqlInsert(insert, arg);
		return response;
	}
}

module.exports = Database;

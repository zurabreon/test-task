/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const utils = require("./utils");

const app = express();

const LIST_OF_SERVICES_ID = [486601, 486603, 486605, 486607, 486609]; // id полей услуг клиники
const WITH_PARAM_ARRAY = ['contacts', 'tasks'];
const TYPE_TASK_FOR_CHECK = 3186358; // id типа задачи "Проверить"
const MILISENCONDS_IN_PER_SECOND = 1000;
const UNIXSENCONDS_IN_ONE_DAY = 86400;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken();

app.get("/", (req, res) => res.send("123"));

app.get("/ping", (req, res) => res.send("pong " + Date.now()));

app.post("/hook", async (req, res) => {

	const contactsRequareBody = req.body.contacts;

	if (contactsRequareBody) {

		const [{id:contactId}] = contactsRequareBody.update;

		const contact = await api.getContact(contactId);

		const deal = contactsRequareBody.update[0].linked_leads_id;

		const [ dealId ] = Object.keys(deal).map(Number);

		if (!deal) {
			console.log("Contact isn't attatched to the deal");
			return;
		}
		
		const dealPromise = await api.getDeal(dealId, WITH_PARAM_ARRAY);

		const isContactMain = dealPromise._embedded.contacts.find(item => item.id === Number(contactId)).is_main;

		if (!isContactMain) {
			console.log("Contact isn't main");
			return;
		}
				
		const servicesBill = LIST_OF_SERVICES_ID.reduce((accum, elem) => accum + Number(utils.getFieldValues(contact.custom_fields_values, elem)), 0);
		
		const updatedLeadsValues = {
			id: dealId,
			price: servicesBill,
		}		
		
		api.updateDeals(updatedLeadsValues);

		const completeTill = Math.floor(Date.now() / MILISENCONDS_IN_PER_SECOND) + UNIXSENCONDS_IN_ONE_DAY;

		const tasksPromise = await api.getTasks([dealId, isContactMain]);


		if (!tasksPromise.find(item => (item.entity_id === dealId && !item.is_completed))) {
			const addTaskField = {
				task_type_id: TYPE_TASK_FOR_CHECK,
				text: "Проверить бюджет",
				complete_till: completeTill,
				entity_id: dealId,
				entity_type: "leads",
			}
	
			api.createTasks(addTaskField);
		}
		else {
			console.log("Task has already been created");
		}	
	}
	
	res.sendStatus(200);
});

app.post("/hookTask", async (req, res) => {
	
	const tasksRequreBody = req.body.task;

	console.log(tasksRequreBody);

	if(tasksRequreBody) {

		const [{element_id:elementId}] = tasksRequreBody.update;

		const createdNoteField = [{
			entity_id: elementId,
			entity_type: "leads",
			note_type: "common",
			params: {
				text: "Бюджет проверен, ошибок нет"
			},
		}];

		api.createNotes(createdNoteField);
	}
	else{
		console.log("Task update error");
	}

	logger.debug(tasksRequreBody);

	res.sendStatus(200);
});

app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
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
const TYPE_TASK_FOR_CHECK = 3186358; // id типа задачи "Проверить"
const MILISENCONDS_IN_PER_SECOND = 1000;
const UNIX_ONE_DAY = 86400;

const Entities = {
	Contacts: "contacts",
	Leads: "leads",
}

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

		const [ dealId ] = Object.keys(contactsRequareBody.update[0].linked_leads_id).map(Number);

		if (!dealId) {
			logger.debug("Contact isn't attatched to the deal");
			return;
		}
		
		const deal = await api.getDeal(dealId, [Entities.Contacts]);

		const isContactMain = deal._embedded.contacts.find(item => item.id === Number(contactId)).is_main;

		if (!isContactMain) {
			logger.debug("Contact isn't main");
			return;
		}
				
		const servicesBill = LIST_OF_SERVICES_ID.reduce((accum, elem) => accum + Number(utils.getFieldValues(contact.custom_fields_values, elem)), 0);
		
		const updatedLeadsValues = {
			id: dealId,
			price: servicesBill,
		}		
		
		await api.updateDeals(updatedLeadsValues);

		const completeTill = Math.floor(Date.now() / MILISENCONDS_IN_PER_SECOND) + UNIX_ONE_DAY;

		const tasks = await api.getTasks([dealId]);

		const isTaskAlreadyCreated = tasks.find(item => (item.entity_id === dealId && !item.is_completed));

		if (!isTaskAlreadyCreated) {
			const addTaskField = {
				responsible_user_id: deal.created_by,
				task_type_id: TYPE_TASK_FOR_CHECK,
				text: "Проверить бюджет",
				complete_till: completeTill,
				entity_id: dealId,
				entity_type: Entities.Leads,
			}
	
			await api.createTasks(addTaskField);
		}
		else {
			logger.debug("Task has already been created");
		}	
	}
	
	res.status(200).send({message: "ok"});
});

app.post("/hookTask", async (req, res) => {
	
	const tasksRequreBody = req.body.task;

	if(tasksRequreBody) {

		const [{element_id:elementId}] = tasksRequreBody.update;

		const createdNoteField = [{
			entity_id: elementId,
			entity_type: Entities.Leads,
			note_type: "common",
			params: {
				text: "Бюджет проверен, ошибок нет"
			},
		}];

		await api.createNotes(createdNoteField);
	}
	else{
		logger.debug("Task update error");
	}

	logger.debug(tasksRequreBody);

	res.status(200).send({message: "ok"});
});

app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
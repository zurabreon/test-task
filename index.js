/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const utils = require("./utils");

const app = express();

const LIST_OF_SERVICES_ID = [486601, 486603, 486605, 486607, 486609];
const WITH_PARAM_ARRAY = ['contacts', 'tasks'];
const TYPE_TASK_FOR_CHECK = 3186358;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken();

app.get("/", (req, res) => res.send("123"));

app.get("/ping", (req, res) => res.send("pong " + Date.now()));

app.post("/hook", async (req, res) => {

	const contactsRequareBody = req.body.contacts;

	if (contactsRequareBody) {

		//попробовать сделать через object.keys

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

		const completeTill = Math.floor(Date.now() / 1000) + 86400;

		const tasksPromise = await api.getTasks();


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
	
	return;
});
	
app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
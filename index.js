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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken();

app.get("/", (req, res) => res.send("123"));

app.get("/ping", (req, res) => res.send("pong " + Date.now()));

app.post("/hook", async (req, res) => {

	let servicesBill;

	const contactsRequareBody = req.body.contacts;

	if (contactsRequareBody) {
		
		let dealId;
		const [{id:contactId}] = contactsRequareBody.update;
		
		const contact = await api.getContact(contactId);

		const deal = contactsRequareBody.update[0].linked_leads_id;

		for (let i in deal) {
			dealId = i;
		}

		//билл возвращает undefined потому что не считывается переменные. Нужно сделать так, чтобы считывались. Потом обновить сделки передав промис

		for (let item of LIST_OF_SERVICES_ID) {
			servicesBill += Number(utils.getFieldValues(contact.custom_fields_values, item));
			console.log(item);
		}

		
		console.log(contact.custom_fields_values);
		
		/*const qwerty = await api.getDeal(dealId);
		
		const updateLeadsPrice = utils.makeField(qwerty.price, servicesBill);

		console.log(updateLeadsPrice);*/
		
	}
	
	return;
});
	
app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
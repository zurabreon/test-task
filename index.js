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
const CONTACT_NAME_ARRAY = ['contacts']

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken();

app.get("/", (req, res) => res.send("123"));

app.get("/ping", (req, res) => res.send("pong " + Date.now()));

app.post("/hook", async (req, res) => {

	let servicesBill = 0;

	const contactsRequareBody = req.body.contacts;

	if (contactsRequareBody) {
		
		let dealId;
		const [{id:contactId}] = contactsRequareBody.update;

		const contact = await api.getContact(contactId);

		const deal = contactsRequareBody.update[0].linked_leads_id;

		if (deal === undefined) {
			console.log("Contact isn't attatched to the deal");
			return;
		}
		
		for (let i in deal) {
			dealId = Number(i);
		}
		
		let dealPromise = await api.getDeal(dealId, CONTACT_NAME_ARRAY);


		for (let i = 0; i < dealPromise._embedded.contacts.length; i++) {
			if (dealPromise._embedded.contacts[i].id === Number(contactId)) {
				if (dealPromise._embedded.contacts[i].is_main) {
					break;
				}
				else {
					console.log("Contact isn't main");
					return;
				}
			}
		}

		for (let i = 0; i < LIST_OF_SERVICES_ID.length; i++) {
			servicesBill += Number(utils.getFieldValues(contact.custom_fields_values, LIST_OF_SERVICES_ID[i])[0]);
		}
		
		const updatedLeadsValues = {
			id: dealId,
			price: servicesBill,
		}		

		api.updateDeals(updatedLeadsValues);
	}
	
	return;
});
	
app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
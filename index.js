/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	
	
	app.get("/", (req, res) => res.send("123"));

	app.get("/ping", (req, res) => res.send("pong " + Date.now()));



	app.post("/hook", (req, res) => {
		
		var contactId = req.body.contacts.add[0].id;
		var customerAge;
		var birthdayId = 403675;
		const currentData = new Date();


		api.getContact(contactId).then(response => {
			for (i = 0; i < response.custom_fields_values.length; i++)
			{
				if (response.custom_fields_values[i].field_id === birthdayId)
				{
					const birthday = new Date(response.custom_fields_values[i].values[0].value * 1000);

					if (currentData.getFullYear() - birthday.getFullYear() > 0) {
						customerAge = currentData.getFullYear() - birthday.getFullYear();
					}
					else {
						customerAge = 0;
					}

					if (currentData.getMonth() - birthday.getMonth() < 0 && customerAge != 0) {
						customerAge--;
					}
					else {
						if (currentData.getMonth() - birthday.getMonth() === 0 && currentData.getDate() - birthday.getDate() < 0 && customerAge != 0) {
							customerAge--;
						}
					}
					var customerAgeObject = {
						field_id: 410341,
						field_name: 'Возраст',
						field_code: null,
						field_type: 'numeric',
						values: [
							{
								value: customerAge
							}
						],
					};

					response.custom_fields_values.push(customerAgeObject);

					api.updateContacts(response);

					logger.debug(response.custom_fields_values)
					break;
				}
			}
		})
		
		
		
		res.send("OK");
	});
	
	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});
 
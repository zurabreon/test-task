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

		api.getContact(contactId).then(response => {
			
		})
		
		
		
		res.send("OK");
	});
	
	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});
 
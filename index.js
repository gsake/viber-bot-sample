const config = require('./config.json');

const TOKEN = config.token;
const WEBHOOK_URL = config.expose_domain + config.expose_uri_path;
const PORT = config.port;


const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;

const express = require('express'); 
const app = express();
const logger = require('./logger');

const bot = new ViberBot({
	logger: logger,
	authToken: TOKEN,
	name: config.name,
	avatar: config.avatar
});

bot.on(BotEvents.SUBSCRIBED, response => {

	response.send(new TextMessage(`Hi ${response.userProfile.name}, my name is ${bot.name}!`));
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
	response.send(new TextMessage(`I have received the following message: ${message}`));
});

app.use(config.expose_uri_path, bot.middleware());

app.listen(PORT, () => {

	logger.info(`Application is running! Port: ${PORT}`);

	bot.setWebhook(WEBHOOK_URL).catch(error => {
		logger.debug(`Error: The webhook ${WEBHOOK_URL} cannot be set. ${error}`);
		process.exit(1);
	});

});


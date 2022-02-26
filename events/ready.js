const logger = require('../utils/logger');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		logger.info(`I am online! Logged in as ${client.user.tag}`);
	},
};
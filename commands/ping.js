module.exports = {
	name: 'ping',
	description: 'Check the bot ping',
	execute(message, args) {
		message.reply(`Bot ping: ${message.client.ws.ping}ms.`);
	},
};
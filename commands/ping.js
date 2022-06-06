module.exports = {
	name: 'ping',
	description: 'Check the bot ping',
	async execute(message, args) {
		message.reply(`Bot ping: ${message.client.ws.ping}ms.`);
	},
	cooldown: 5,
};
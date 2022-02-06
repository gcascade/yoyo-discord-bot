const commandPrefix = '!';

module.exports = {
	name: 'message',
	async execute(message) {
		if (!message.content.startsWith(commandPrefix) || message.author.bot) return;

		const args = message.content.slice(commandPrefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command = message.client.commands.get(commandName);

		if (!command) return;

		try {
			await command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
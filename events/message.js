const logger = require('../utils/logger');
const Discord = require('discord.js');

const commandPrefix = '!';
const cooldowns = new Map();

module.exports = {
	name: 'message',
	async execute(message) {
		if (!message.content.startsWith(commandPrefix) || message.author.bot) return;

		const args = message.content.slice(commandPrefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command = message.client.commands.get(commandName);

		if (!command) return;

		if (command.cooldown) {
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Discord.Collection());
			}

			const timestamps = cooldowns.get(command.name);
			const now = Date.now();

			if (timestamps.has(message.author.id)) {
				const commandCooldownInMs = command.cooldown * 1000;
				const expirationTime = timestamps.get(message.author.id) + commandCooldownInMs;

				if (now < expirationTime) {
					const time = (expirationTime - now) / 1000;

					return message.reply(`Please wait another ${time.toFixed(2)} seconds before using the '${command.name}' command`);
				}
			}

			timestamps.set(message.author.id, now);
		}

		try {
			await command.execute(message, args);
		}
		catch (error) {
			logger.error(error);
			await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
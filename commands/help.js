const Discord = require('discord.js');
const { parseCommandArguments, includesOption } = require('../utils/optionsUtil');

module.exports = {
	name: 'help',
	description: 'Describe every command the bot knows. Display additional info. with `-v`',
	options: [{
		name: 'verbose',
		value: '-v',
		aliases: ['-verbose'],
		description: 'Display additional information',
		additionalParameter: false,
	}],
	execute(message, args) {
		const fields = [];
		message.client.commands.forEach(command => {
			let fieldValue = command.description;

			const argOptions = parseCommandArguments(args, this.options);

			if (includesOption(argOptions, 'verbose') && command.options) {
				command.options.forEach(option => fieldValue += `\n > **\`${option.value}\`**\t${option.description}${option.aliases && option.aliases.length > 0 ? '. *Aliases: ' + option.aliases.join(', ') + '*' : ''}`);
			}
			fields.push({ name: command.name, value: fieldValue });
		});

		// TODO next : -v && display options && display single command
		const embed = new Discord.MessageEmbed()
			.setColor('#5BFFDA')
			.setTitle('Help')
			.setDescription('Here\'s a description of the commands you can use')
			.addFields(fields)
			.setFooter({ text: 'Commands can be invoked with !' });
		message.channel.send({ embeds: [embed] });
	},
};
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Describe every command the bot knows',
	execute(message, args) {
		const fields = [];
		message.client.commands.forEach(command => fields.push({ name: command.name, value: command.description }));
		const embed = new Discord.MessageEmbed()
			.setColor('#5BFFDA')
			.setTitle('Help')
			.setDescription('Here\'s a description of the commands you can use')
			.addFields(fields)
			.setFooter({ text: 'Commands can be invoked with !' });
		message.channel.send({ embeds: [embed] });
	},
};
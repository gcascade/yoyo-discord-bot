const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Describe every command the bot knows',
	execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor('#5BFFDA')
			.setTitle('Help')
			.setDescription('Here\'s a description of the commands you can use')
			.addFields(
				{ name: 'clear', value: 'Clear the chat messages' },
				{ name: 'github', value: 'Send a link to the bot\'s Github page' },
				{ name: 'play', value: 'Join the user\'s voice channel and play a video from Youtube' },
				{ name: 'leave', value: 'Leave current voice channel' },
			)
			.setFooter({ text: 'Commands can be invoked with !' });
		message.channel.send({ embeds: [embed] });
	},
};
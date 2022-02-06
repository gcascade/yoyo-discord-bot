const emojiCharacters = require('../emojiCharacters.js');

const pauseFilter = (reaction, user) => {
	return [emojiCharacters.pauseUnpause].includes(reaction.emoji.name)
    && reaction.message.author.bot
    && reaction.message.mentions.repliedUser.id === user.id
    && reaction.message.client.player[reaction.message.guild.id]
    && reaction.message.client.connection[reaction.message.guild.id];
};

module.exports = {
	name: 'messageReactionRemove',
	async execute(reaction, user) {
		if (user.bot) {
			return;
		}
		if (!reaction.message.guild) {
			return;
		}
		if (!reaction.message.client.player[reaction.message.guild.id]) {
			return;
		}

		if (pauseFilter(reaction, user)) {
			reaction.message.client.player[reaction.message.guild.id].unpause();
		}
	},
};
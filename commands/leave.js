const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'leave',
	description: 'Leave channel',
	cooldown: 5,
	async execute(message, args) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			return message.reply('You need to be in a voice channel');
		}
		const connection = getVoiceConnection(voiceChannel.guild.id);
		await connection.destroy();

		await message.channel.send('Left voice channel');
	},
};
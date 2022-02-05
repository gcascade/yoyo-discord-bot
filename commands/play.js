const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const emojiCharacters = require('../emojiCharacters.js');

function initPlayer(client, message, video, connection) {
	if (!client.player[message.guild.id]) {
		client.player[message.guild.id] = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		client.player[message.guild.id].on(AudioPlayerStatus.Playing, () => {
			message.reply(`Now playing *** ${video.title} ***`)
				.then((reply) => reply.react(emojiCharacters.pauseUnpause))
				.catch(console.error);
		});
		client.player[message.guild.id].on(AudioPlayerStatus.Paused, () => message.reply('The audio player is paused'));
		client.player[message.guild.id].on(AudioPlayerStatus.Idle, () => connection.destroy());
		client.player[message.guild.id].on('error', error => console.error(`Error: ${error.message}`));
	}
}

module.exports = {
	name: 'play',
	description: 'Join the user\'s voice channel and play a video from Youtube',
	async execute(message, args) {
		const voiceChannel = message.member.voice.channel;
		const client = message.client;

		if (!voiceChannel) {
			return message.channel.send('You need to be in a channel to execute this command');
		}

		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has(['CONNECT', 'SPEAK'])) {
			return message.channel.send('You don\'t have the correction permissions');
		}
		if (!args.length) {
			return message.channel.send('Missing arguments');
		}

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false,
		});

		client.connection[message.guild.id] = connection;

		const videoFinder = async (query) => {
			const videoResult = await ytSearch(query);

			return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
		};

		const video = await videoFinder(args.join(' '));

		if (video) {
			const stream = ytdl(video.url, { filter: 'audioonly' });
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

			initPlayer(client, message, video, connection);

			client.player[message.guild.id].play(resource);
			connection.subscribe(client.player[message.guild.id]);
		}
		else {
			message.reply('No results');
			connection.destroy();
		}
	},
};

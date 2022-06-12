const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const emojiCharacters = require('../utils/emojiCharacters.js');
const logger = require('../utils/logger');
const { getUriQueryArgs } = require('../utils/stringUtils');


function initPlayer(client, message, connection) {
	if (!client.player[message.guild.id]) {
		client.player[message.guild.id] = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		client.player[message.guild.id].on(AudioPlayerStatus.Playing, () => {
			client.player[message.guild.id].lastMessage.reply(`${emojiCharacters.musicNote} Now playing *** ${client.player[message.guild.id].currentVideo.title} *** ${emojiCharacters.musicNote}`)
				.then((reply) => reply.react(emojiCharacters.pauseUnpause))
				.catch((error) => logger.error(error));
		});
		client.player[message.guild.id].on(AudioPlayerStatus.Paused, () => message.reply('The audio player is paused'));
		client.player[message.guild.id].on(AudioPlayerStatus.Idle, () => {
			try {
				connection.destroy();
			}
			catch (error) {
				logger.error(error);
			}
		});
		client.player[message.guild.id].on('error', error => logger.error(`[Music Player] Error: ${error.message}`));
	}
}

module.exports = {
	name: 'play',
	description: 'Join the user\'s voice channel and play a video from Youtube',
	cooldown: 10,
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
			if (/^https:\/\/.*youtube\.com.*/gui.test(query)) {
				let ytQuery = query;
				const uriArgs = getUriQueryArgs(query);
				if (uriArgs && uriArgs['v']) {
					ytQuery = {
						videoId: uriArgs['v'],
					};
				}

				const video = await ytSearch(ytQuery);

				return video;
			}
			else {
				const videoResult = await ytSearch(query);

				return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
			}
		};

		const video = await videoFinder(args.join(' '));

		if (video) {
			const stream = ytdl(video.url, { filter: 'audioonly' });
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

			initPlayer(client, message, connection);

			client.player[message.guild.id].currentVideo = video;
			client.player[message.guild.id].lastMessage = message;
			client.player[message.guild.id].play(resource);
			connection.subscribe(client.player[message.guild.id]);
		}
		else {
			message.reply('No results');
			connection.destroy();
		}
	},
};

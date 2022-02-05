const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const emojiCharacters = require('./emojiCharacters.js');

require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const commandPrefix = '!';

const token = process.env.TOKEN;

client.commands = new Collection();
client.player = [];
client.connection = [];

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('I am online!');
});

client.on('message', async message => {
	if (!message.content.startsWith(commandPrefix) || message.author.bot) return;

	const args = message.content.slice(commandPrefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName);

	if (!command) return;

	try {
		await command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const pauseFilter = (reaction, user) => {
	return [emojiCharacters.pauseUnpause].includes(reaction.emoji.name)
    && reaction.message.author.bot
    && reaction.message.mentions.repliedUser.id === user.id
    && client.player[reaction.message.guild.id]
    && client.connection[reaction.message.guild.id];
};

client.on('messageReactionAdd', async (reaction, user) => {
	if (user.bot) {
		return;
	}
	if (!reaction.message.guild) {
		return;
	}
	if (!client.player[reaction.message.guild.id]) {
		return;
	}

	if (pauseFilter(reaction, user)) {
		client.player[reaction.message.guild.id].pause();
	}
});

client.on('messageReactionRemove', async (reaction, user) => {
	if (user.bot) {
		return;
	}
	if (!reaction.message.guild) {
		return;
	}
	if (!client.player[reaction.message.guild.id]) {
		return;
	}

	if (pauseFilter) {
		client.player[reaction.message.guild.id].unpause();
	}
});

client.login(token);
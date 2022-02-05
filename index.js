const { Client, Collection, Intents } = require('discord.js');
const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const commandPrefix = '!';

const token = process.env.TOKEN

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('I am online!');
});

client.on('message', message => {
    if (!message.content.startsWith(commandPrefix) || message.author.bot)
        return;
    
    const args = message.content.slice(commandPrefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'hello') {
        client.commands.get('hello').execute(message, args);
    } else if (command === 'github') {
        client.commands.get('github').execute(message, args, Discord);
    } else if (command === 'help') {
        client.commands.get('help').execute(message, args, Discord);
    } else if (command === 'clear') {
        client.commands.get('clear').execute(message, args);
    } else if (command === 'play') {        
        client.commands.get('play').execute(message, args);
    } else if (command === 'leave') {        
        client.commands.get('leave').execute(message, args);
    }
})

client.login(token)
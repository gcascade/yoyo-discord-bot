const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commandPrefix = '!';

const token = ''

client.once('ready', () => {
    console.log('I am online!');
});

client.on('message', message => {
    if (!message.content.startsWith(commandPrefix) || message.author.bot)
        return;
    
    const args = message.content.slice(commandPrefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'hello') {
        message.channel.send('Hello I am Yoyo\'s Discord Bot!');
    } else if (command === 'github') {
        message.channel.send("https://github.com/gcascade/yoyo-discord-bot");
    }
})

client.login(token)
module.exports = {
    name: 'github',
    description: 'Link to the bot\'s source code',
    execute(message, args) {
        message.channel.send("https://github.com/gcascade/yoyo-discord-bot");
    }
}
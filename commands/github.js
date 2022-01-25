module.exports = {
    name: 'github',
    description: 'Link to the bot\'s source code',
    execute(message, args, Discord) {
        require('dotenv').config();

        const authorizedRole = process.env.AUTHORIZED_ROLE_ID

        if (!authorizedRole || message.member.roles.cache.has(authorizedRole)) {
            message.channel.send("https://github.com/gcascade/yoyo-discord-bot");
        } else {
            message.channel.send("You don\'t have sufficient permissions for this command.");
        }
    }
}
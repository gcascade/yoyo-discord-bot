module.exports = {
    name: 'clear',
    description: 'Clear the chat messages',
    async execute(message, args, Discord) {
        require('dotenv').config();

        const authorizedRole = process.env.AUTHORIZED_ROLE_ID

        if (!authorizedRole || message.member.roles.cache.has(authorizedRole)) {            
            // Permission required, send an error message if the bot does not have the permission
            if (message.guild.me.permissions.has("MANAGE_MESSAGES") || message.channel.permissionsFor(message.guild.me)) {
                const number = args[0]
                if (!number) {
                    await message.channel.messages.fetch().then(messages => {
                        // Disabled - ask confirmation before clearing all messages
                        // message.channel.bulkDelete(messages);
                        message.channel.send("Enter a real, positive number.")
                    });                
                } else if (isNaN(number) || number < 1) {
                    message.channel.send("Enter a real, positive number.");
                } else {
                    await message.channel.messages.fetch({limit: number}).then(messages => {
                        message.channel.bulkDelete(messages);
                    });
                }

            } else {
                message.channel.send("I do not have the permission to clear messages");
            }
        } else {
            message.channel.send("You don\'t have sufficient permissions for this command.");
        }
    }
}
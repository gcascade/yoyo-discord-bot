module.exports = {
    name: 'clear',
    description: 'Clear the chat messages',
    async execute(message, args) {
        require('dotenv').config();

        const authorizedRole = process.env.AUTHORIZED_ROLE_ID

        if (!authorizedRole || message.member.roles.cache.has(authorizedRole)) {            
            // Permission required, send an error message if the bot does not have the permission
            if (message.guild.me.permissions.has("MANAGE_MESSAGES") || message.channel.permissionsFor(message.guild.me)) {
                const number = args[0]
                if (!number) {                    
                        // Ask confirmation before clearing all messages
                        await message.reply('This will clear all messages (max. 100). Please confirm(Y)').then(() => {
                            const filter = m => message.author.id === m.author.id;
                        
                            message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] })
                                .then(responses => {
                                    const response = responses.first().content.toLowerCase();
                                    if (response === "y" || response === "yes") {
                                        message.channel.messages.fetch().then(messages => {    
                                            message.channel.bulkDelete(messages);
                                        });
                                    } else {
                                        message.reply("No messages were deleted")
                                    }
                                })
                                .catch(() => {
                                    message.reply("No input received. No messages were deleted");
                                });
                        });            
                } else if (isNaN(number) || number < 1) {
                    message.channel.send("Enter a real, positive number.");
                } else {
                    if (number > 100) {
                        number = 100;
                    }
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
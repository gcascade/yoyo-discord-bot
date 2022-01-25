module.exports = {
    name: 'help',
    description: 'Describe every command the bot knows',
    execute(message, args, Discord) {
        const embed = new Discord.MessageEmbed()
            .setColor('#5BFFDA')
            .setTitle('Help')
            .setDescription('Here\'s a description of the commands you can use')
            .addFields(
                { name: 'Github', value: 'Send a link to the bot\'s Github page'}
            )
            .setFooter('Commands can be invoked with !')
        message.channel.send({embeds: [embed]});
    }
}
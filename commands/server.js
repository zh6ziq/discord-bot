module.exports = {
    name: 'server',
    description: 'Server info',
    execute(message, args) {
        message.channel.send(
            `This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`
        )
    }
}
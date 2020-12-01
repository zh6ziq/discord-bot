module.exports = {
    name: 'kick',
    description: 'Kick user (fake only)',
    guildOnly: true,
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(
                'You need to tag a user'
            )
        }
        const taggedUser = message.mentions.users.first()

        message.channel.send(`You wanted to kick: ${taggedUser.username}`)
    }
}
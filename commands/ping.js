module.exports = {
    name: 'ping',
    cooldown: 5,
    description: 'Ping something',
    execute(message, args) {
        message.channel.send('Pong.');
    }
}
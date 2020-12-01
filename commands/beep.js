module.exports = {
    name: 'beep',
    description: 'Beep something',
    execute(message, args) {
        message.channel.send('Boop')
    }
}
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

//check the bot is ready
client.once('ready', () => {
    console.log('Bot Ready!');
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) 
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;

    //check if command is use inside DM
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I cant execute that command inside DMs!');
    }

    //check if command didnt have arguments
    if (command.args && !args.length) {
        let reply = `You didnt provide any arguments!`;

        if(command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    //set command cooldown to avoid spam
    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
                `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
            )
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    //execute bot commands
    try {
        command.execute(message, args);
    } catch (err) {
        console.log(err);
        message.reply('There was an error trying to execute that command.');
    }
    
    
});

//login to Discord as a bot
client.login(token);
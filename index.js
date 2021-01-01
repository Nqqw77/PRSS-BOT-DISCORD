const Discord = require('discord.js'),
    client = new Discord.Client({

        fetchAllMembers: true
    }),
    config = require('./config.json')
    fs = require('fs')

client.login(config.token)
client.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(message, args, client)
})
client.on(`message`, message => {

    if (message.content === `t!join`)
    client.emit(`guildMemberAdd`, message.member);
});

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`Bienvenue à toi sur le serveur de la __**PRSS**__ ${member}.`)
})

client.on('ready', () => {
    const statuses = [
        'BOT BY NQWW_ 🖤',
        'BOT PRSS 🖤',
        'PRSS > ALL 🖤',
    ]
    let i = 0
    setInterval(() => {
    client.user.setActivity(statuses[i], {type: 'STREAMING', url: 'https://twitch.tv/prss'})
    i = ++i % statuses.length 
    }, 1e4)
    setInterval(() => {
        const [bots, humans] = client.guilds.cache.first().members.cache.partition(member => member.user.bot)
        client.channels.cache.get(config.serverStats.total).setName(`🖤┇Membres : ${client.guilds.cache.first().memberCount}`)
    }, 3e4)
})
const fs = require('node:fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require("./config.json");
const { botPrefix, errorChannel, dWThumbnailPic } = require("./constants");
const { wrap } = require("./util/wrap");
const { getTwitterFollowers } = require("./util/twitterFollowers");
const { getOsFloor } = require("./util/osFloor");
const { createLogger, transports, format } = require('winston');
const getSells = require('./util/openseaSells');
const { combine, timestamp, label, json } = format;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const logger = createLogger({
        level: "info",
        format: combine(
                timestamp(),
                label({ label: "client"}),
                json()
                ),
        transports: [ new transports.Console() ]
})

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
        for (const file of fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`./commands/${folder}/${file}`);
                client.commands.set(command.name, command)
        }
}

client.on('error', error => logger.error(error));
client.on('warn', warn => logger.warn(warn));

client.once('ready', async () => {
        logger.info(`${client.user.username}@${client.user.discriminator} is online`);
        client.user.setStatus("idle");
        await getSells(client);

        setInterval(async () => {
                try {
                        const osFloor = await getOsFloor();
                        const twitterFollowers = await getTwitterFollowers();

                        client.user.setActivity(`Floor: ${osFloor} ETH | !dw help`, { type: "WATCHING" });
                        client.channels.cache.filter(channel => channel.name.includes("Discord:")).map(channel => channel.setName(`Discord: ${channel.guild.memberCount}`));
                        client.channels.cache.filter(channel => channel.name.includes("Twitter:")).map(channel => channel.setName(`Twitter: ${twitterFollowers}`));
                } catch (error) {
                        logger.error(`Update err: ${error}`);
                }
        }, 10000);
});

client.on('messageCreate', async message => {
        if (message.author.username === client.user.username
                || !message.content.startsWith(botPrefix) 
                || message.member.roles.cache.find(role => role.name === "packing heat")?.position > message.member.roles.highest.position
                || !/^[a-zA-Z0-9- ]+$/.test(message.content.replace(botPrefix, ''))) return;

        const command = client.commands.get(message.content.replace(botPrefix, '').toLowerCase().split(' ')[0]);
        const args = message.content.split(' ').slice(1);
        logger.info(`${message.author.tag}/${message.author.id}: ${message.content}`);

        if (!command || !message.channel.permissionsFor(client.user.id).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return;
        if (command.validator && command.validator(args)) {
                const invalidInvocationEmbed = new MessageEmbed()
                        .setTitle("⚠️ Invalid arguments provided")
                        .setColor("YELLOW")
                        .setDescription(`\`${botPrefix}${command.name} ${command.args ?? ''}\`\n${command.description}`)
                        .setThumbnail(dWThumbnailPic);

                await message.reply({ embeds: [invalidInvocationEmbed] });
                return;
        }

        try {
                await command.execute(message, args);
        } catch (error) {
                logger.error(`${error}`);
                const errorEmbed = new MessageEmbed()
                        .setTitle("🚨 Error 🚨")
                        .setFields(
                                { name: `Error Message`, value: `${wrap(error)}` },
                                { name: `Command`, value: `${wrap(command.name)}` },
                                { name: `Arguments`, value: `${wrap(args.join(' '))}` },
                                { name: `User`, value: `${wrap(message.author.tag)}` }
                        )
                        .setTimestamp();

                await client.channels.cache.get(errorChannel).send({ embeds: [errorEmbed] });
                await message.react("❌");
        }
})

client.login(token);

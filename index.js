const fs = require('node:fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require("./config.json");
const { botPrefix, errorChannel, dWThumbnailPic } = require("./constants");
const { wrap } = require("./util/wrap");
const { getTwitterFollowers } = require("./util/twitterFollowers");
const { getOsFloor } = require("./util/osFloor");
const { createLogger, transports, format } = require('winston');
const { combine, timestamp, label, json } = format;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const logger = createLogger({
        level: "info",
        format: combine(
                timestamp(),
                label({ label: "dopebot"}),
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

client.on('error', error => logger.error(error))

client.once('ready', () => {
        logger.info(`${client.user.username}@${client.user.discriminator} is online`);
        client.user.setStatus("idle");

        setInterval(async () => {
                try {
                        client.user.setActivity(`Floor: ${await getOsFloor()} ETH | !help`, { type: "WATCHING" });
                        const twitterFollowers = await getTwitterFollowers();
                        await client.channels.cache.filter(channel => channel.name.includes("Twitter:")).map(channel => channel.setName(`Twitter: ${twitterFollowers}`));
                        await client.channels.cache.filter(channel => channel.name.includes("Discord:")).map(channel => channel.setName(`Discord: ${channel.guild.memberCount}`));
                } catch (error) {
                        logger.error(error);
                }
        }, 10000);
});

client.on('messageCreate', async message => {
        if (message.author.username === client.user.username
                || !message.content.startsWith(botPrefix) 
                || !message.member.roles.cache.find(role => role.name === "packing heat")) return;

        const command = client.commands.get(message.content.replace(botPrefix, '').toLowerCase().split(' ')[0]);
        const args = message.content.split(' ').slice(1);

        if (!command) return;
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
                logger.info(`${message.author.tag}/${message.author.id}: ${command.name} ${args.join(' ')}`);
                await command.execute(message, args);
        } catch (error) {
                const errorEmbed = new MessageEmbed()
                        .setTitle("🚨 Error 🚨")
                        .setFields(
                                { name: `Error Message`, value: `${wrap(error)}` },
                                { name: `Command`, value: `${wrap(command.name)}` },
                                { name: `Arguments`, value: `${wrap(args.join(' '))}` },
                                { name: `User`, value: `${wrap(message.author.tag)}` }
                        )
                        .setTimestamp();

                logger.error(error);
                await client.channels.cache.get(errorChannel).send({ embeds: [errorEmbed] });
                await message.react("❌");
        }
})

client.login(token);

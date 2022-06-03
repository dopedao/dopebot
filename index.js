const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require("./config.json");
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
                client.commands.set(command.data.name, command)
        }
}

client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()
        || interaction.member.roles.cache.find(role => role.name === "packing heat")?.position > interaction.member.roles.highest.position) {
                return;
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
                await command.execute(interaction);
                logger.info(`${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.member.id}) executed ${interaction.commandName}`)
        } catch(error) {
                logger.error(`${error}`);
                await interaction.reply("There was an error executing the command");
        }
});

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

                        client.user.setActivity(`Floor: ${osFloor} ETH`, { type: "WATCHING" });
                        client.channels.cache.filter(channel => channel.name.includes("Discord:")).map(channel => channel.setName(`Discord: ${channel.guild.memberCount}`));
                        client.channels.cache.filter(channel => channel.name.includes("Twitter:")).map(channel => channel.setName(`Twitter: ${twitterFollowers}`));
                } catch (error) {
                        logger.error(`Update err: ${error}`);
                }
        }, 10000);
});


client.login(token);

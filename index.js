const fs = require('node:fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require("./config.json");
const { botPrefix, errorChannel, dWThumbnailPic } = require("./constants");
const { wrap } = require("./util/wrap");
const { getTwitterFollowers } = require("./util/twitterFollowers");
const { getOsFloor } = require("./util/osFloor");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
        for (const file of fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`./commands/${folder}/${file}`);
                client.commands.set(command.name, command)
        }
}

client.once('ready', () => {
        console.log(`${client.user.username}@${client.user.discriminator} is online\n`
                + `Start time: ${new Date()}\n`
                + `Guilds: ${client.guilds.cache.size}\n`
                + `User count: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`);
        client.user.setStatus("idle");

        setInterval(async () => {
                try {
                        client.user.setActivity(`Floor: ${await getOsFloor()} ETH`, { type: "WATCHING" })
                        client.channels.cache.find(channel => channel.name.includes("Twitter:"))?.setName(`Twitter: ${await getTwitterFollowers()}`);
                        client.channels.cache.filter(channel => channel.name.includes("Discord:")).map(channel => channel.setName(`Discord: ${channel.guild.memberCount}`));
                } catch (error) {
                        console.log(error);
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
                await command.execute(message, args);
        } catch (error) {
                const errorEmbed = new MessageEmbed()
                        .setTitle("🚨 Error 🚨")
                        .setFields(
                                { name: `Error Message`, value: `${wrap(error)}` },
                                { name: `Command`, value: `${wrap(command.name)}` },
                                { name: `Arguments`, value: `${wrap(args.join())}` },
                                { name: `User`, value: `${wrap(message.author.tag)}` }
                        )
                        .setTimestamp();

                await client.channels.cache.get(errorChannel).send({ embeds: [errorEmbed] });
                await message.reply({ content: error?.customError ?? "There was an error while executing this command!", ephemeral: true });
        }
})

client.login(token);

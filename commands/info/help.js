const { MessageEmbed } = require('discord.js');
const { DW_THUMBNAIL, BOT_PREFIX } = require('../../constants');
const fs = require('node:fs');

module.exports = {
    name: "dw",
    description: "Displays all available commands, with their description",
    args: "help",
    validator: ([option]) => !["help"].includes(option),
    async execute(message) {
        const commands = [];
        const commandFolders = fs.readdirSync("./commands");
        for (const folder of commandFolders) {
            for (const file of fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.push(command);
            }
        }

        const helpEmbed = new MessageEmbed()
            .setTitle("Command Overview")
            .setColor("#36393F")
            .setTimestamp()
            .setThumbnail(DW_THUMBNAIL);

        commands.forEach(command => {
            helpEmbed.addField(`${BOT_PREFIX}${command.name} ${command.args ?? ""}`, `${command.description}`, false);
        });

        await message.channel.send({ embeds: [helpEmbed] });
    }
}
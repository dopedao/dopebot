const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "wen",
    description: `\`moon\` - Tells you wen moon fren\n`,
    args: "[moon]",
    validator: ([option]) => !option || !["moon"].includes(option),
    async execute(message, [option]) {
        let embedToSend = {
           "moon" : await getMoonDate()
        }

        await message.channel.send(embedToSend[option]);
    }
};

const getMoonDate = () => {
    const moonDate = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US');

    const moonEmbed = new MessageEmbed()
        .setColor("WHITE")
        .setTitle("Secret Moon Date 👀")
        .setDescription(`${moonDate} 🚀 🌑`);

    return { embeds: [moonEmbed] };
}
const { MessageEmbed } = require("discord.js");
const { dWThumbnailPic } = require("../../constants");

module.exports = {
    name: "wen",
    description: `\`moon\` - Tells you wen moon fren\n\`game\` - Tells you wen game`,
    args: "[moon | game]",
    validator: ([option]) => !option || !["moon", "game"].includes(option),
    async execute(message, [option]) {
        const fnMap = {
            "moon": sendMoonDate,
            "game": sendGameEmbed
        }

        await fnMap[option](message);
    }
};

const sendMoonDate = async (message) => {
    const moonDate = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US');

    const moonEmbed = new MessageEmbed()
        .setColor("WHITE")
        .setTitle("Secret Moon Date 👀")
        .setDescription(`${moonDate} 🚀 🌑`);

    await message.channel.send({ embeds: [moonEmbed] });
}

const sendGameEmbed = async (message) => {
    const wenGameEmbed = new MessageEmbed()
        .setTitle("Wen game ❓❓")
        .setColor("NOT_QUITE_BLACK")
        .setDescription("The game is actively in the design and development stage.\nSince it is a community led project with many moving parts,\nthere is no solid date for the game release.\nThe best way to track our progress is via our wiki page ([Roadmap](https://google.com)), DopeDao [updates](https://dope-wars.notion.site/0121b6435eb84e869231501295d729bd?v=f493d6b27ffd4816861308561197702a) and discord channels.")
        .setThumbnail(dWThumbnailPic);
    
    await message.channel.send({ embeds: [wenGameEmbed] });
}
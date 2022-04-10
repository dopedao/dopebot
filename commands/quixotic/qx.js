const { sfetch } = require("../../util/sfetch");
const { quixoticDwApi, qxRed, quixoticCollectionLink, dWThumbnailPic, qxApiEthConvValue, quixoticDwGearApi } = require("../../constants");
const { quixoticApiKey } = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const { wrap } = require("../../util/wrap");

module.exports = {
    name: "qx",
    description: "\`hustler\` - Quixotic Hustler stats\n\`gear\` - QuixoticGear stats",
    args: "[hustler | gear]",
    validator: ([option]) => !option || !["hustler", "gear"].includes(option),
    async execute(message, [option]) {
        switch (option) {
            case "hustler":
                await getHustlerStats(message);
                break;
            case "gear":
                await getGearStats(message)
                break;
            default:
                break;
        }
    }
};

const getHustlerStats = async (message) => {
    const collectionData = await sfetch(quixoticDwApi, { headers: { "X-API-KEY": quixoticApiKey } });
    if (!collectionData) {
        return Promise.reject();
    }

    const qxHustlerStatsEmbed = new MessageEmbed()
        .setTitle("🔴✨ Quixotic Hustler Stats - DopeWars")
        .setURL(quixoticCollectionLink)
        .setThumbnail(dWThumbnailPic)
        .setColor(qxRed)
        .setFields(
            { name: "🥇 Trading Volume", value: `${wrap((collectionData.volume_traded / qxApiEthConvValue).toFixed(2) + " ETH")}`, inline: true },
            { name: "🧹 Floor", value: `${wrap((collectionData.floor_price / qxApiEthConvValue).toFixed(4) + " ETH")}`, inline: true }
        )

    await message.channel.send({ embeds: [qxHustlerStatsEmbed] });
}

const getGearStats = async (message) => {
    const gearData = await sfetch(quixoticDwGearApi, { headers: { "X-API-KEY": quixoticApiKey } });
    if (!gearData) {
        return Promise.reject();
    }

    const qxGearStatsEmbed = new MessageEmbed()
        .setTitle("🔴✨ Quixotic Gear Stats - DopeWars")
        .setURL(quixoticCollectionLink)
        .setThumbnail(dWThumbnailPic)
        .setColor(qxRed)
        .setFields(
            { name: "🥇 Trading Volume", value: `${wrap((gearData.volume_traded / qxApiEthConvValue).toFixed(2) + " ETH")}`, inline: true },
            { name: "🧹 Floor", value: `${wrap((gearData.floor_price / qxApiEthConvValue).toFixed(4) + " ETH")}`, inline: true },
        )

    await message.channel.send({ embeds: [qxGearStatsEmbed] });
}
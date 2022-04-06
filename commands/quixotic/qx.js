const { sfetch } = require("../../util/sfetch");
const { quixoticDwApi, qxRed, quixoticCollectionLink, dWThumbnailPic, qxApiEthConvValue } = require("../../constants");
const { quixoticApiKey } = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const { wrap } = require("../../util/wrap");

module.exports = {
    name: "qx",
    description: "Quixotic Test commands",
    args: "(1-8000)",
    async execute(message) {
        const collectionData = await sfetch(quixoticDwApi, { headers: { "X-API-KEY": quixoticApiKey } });
        if (!collectionData) {
            return Promise.reject();
        }

    const qxStatsEmbed = new MessageEmbed()
        .setTitle("🔴✨ Quixotic Stats - DopeWars")
        .setURL(quixoticCollectionLink)
        .setThumbnail(dWThumbnailPic)
        .setColor(qxRed)
        .setFields(
            {name: "🥇 Trading Volume", value: `${wrap((collectionData.volume_traded / qxApiEthConvValue).toFixed(2) + " ETH")}`, inline:true},
            {name: "🧹 Floor", value: `${wrap((collectionData.floor_price / qxApiEthConvValue).toFixed(2) + " ETH")}`, inline:true}
        )
        await message.channel.send({ embeds: [qxStatsEmbed] });
    }
};

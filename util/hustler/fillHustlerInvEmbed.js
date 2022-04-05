const { MessageEmbed } = require("discord.js");
const { quixoticCollectionLink, dWThumbnailPic } = require("../../constants");
const { hustlerObject } = require("./hustlerObj");

module.exports = {
    fillHustlerEmbed(hustler, id) {
        const hustlerRoot = hustler.data.hustlers.edges[0].node;
        const hustlerMap = new Map(Object.entries(hustlerRoot));

        for (const keypair of hustlerMap) {
            hustlerObject[keypair[0]] = keypair[1]?.fullname ?? keypair[1];
        }

        const hustlerInvEmbed = new MessageEmbed()
            .setTitle(`Hustler #${id} Inventory`)
            .setColor("#FF0420")
            .setDescription(`**Name:** \`${hustlerObject.name}\`\n**Title:** \`${hustlerObject.title}\`\n**Type:** \`${hustlerObject.type}\``)
            .setFields(
                { name: "⛓️ Neck", value: `${hustlerObject.neck}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "💍 Ring", value: `${hustlerObject.ring}`, inline: true },
                { name: "🦺 Clothes", value: `${hustlerObject.clothes}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "🥊 Hand", value: `${hustlerObject.hand}`, inline: true },
                { name: "🩲 Waist", value: `${hustlerObject.waist}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "🗡️ Weapon", value: `${hustlerObject.weapon}`, inline: true },
                { name: "👞 Foot", value: `${hustlerObject.foot}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "🐊 Drug", value: `${hustlerObject.drug}`, inline: true },
                { name: "🚓 Vehicle", value: `${hustlerObject.vehicle}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "🎭 Accessory", value: `${hustlerObject.accessory ?? 'none :('}`, inline: true },
                { name: "🔴✨ Quixotic", value: `[Listing](${quixoticCollectionLink}/${id})`, inline: true }
            )
            .setThumbnail(dWThumbnailPic);

        return hustlerInvEmbed;
    }
}

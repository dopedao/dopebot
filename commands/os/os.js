const { sfetch } = require('../../util/sfetch');
const { dWOpenSeaApiLink, osBlue, openseaCollectionLink } = require('../../constants');
const { getDailyMarketStatsEmbed, getWeeklyMarketStatsEmbed, getMonthlyStatsEmbed } = require('../../util/marketStatsEmbed');

module.exports = {
    name: "os",
    description: "Shows various Dope OpenSea stats",
    args: "[daily | weekly | monthly]",
    validator: ([option]) => !option || !["daily", "weekly", "monthly"].includes(option),
    async execute(message, [option]) {
        const fnMap = {
            "daily": dailyOsStats,
            "weekly": weeklyOsStats,
            "monthly": monthlyOsStats
        }

        await fnMap[option](message);
    }
}

const dailyOsStats = async (message) => {
    const osStats = await sfetch(dWOpenSeaApiLink);
    const dailyStatsEmbed = getDailyMarketStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(openseaCollectionLink)
        .setColor(osBlue);
        
    await message.channel.send({ embeds: [dailyStatsEmbed] });
}

const weeklyOsStats = async (message) => {
    const osStats = await sfetch(dWOpenSeaApiLink);
    const weeklyStatsEmbed = getWeeklyMarketStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(openseaCollectionLink)
        .setColor(osBlue);

    await message.channel.send({ embeds: [weeklyStatsEmbed] });
}

const monthlyOsStats = async (message) => {
    const osStats = await sfetch(dWOpenSeaApiLink);
    const monthlyStatsEmbed = getMonthlyStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(openseaCollectionLink)
        .setColor(osBlue);

    await message.channel.send({ embeds: [monthlyStatsEmbed] });
}
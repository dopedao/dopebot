const { sfetch } = require("../../util/sfetch");
const { quixoticGearStats, qxRed, quixoticCollectionLink, quixoticHustlerStats } = require("../../constants");
const { quixoticApiKey } = require("../../config.json");
const { getDailyMarketStatsEmbed, getWeeklyMarketStatsEmbed, getMonthlyStatsEmbed } = require("../../util/marketStatsEmbed");

module.exports = {
    name: "qx",
    description: "\`hustler\` - Quixotic Hustler stats\n\`gear\` - Quixotic Gear stats",
    args: "[hustler | gear] (daily | weekly | monthly)",
    validator: ([collection, timeFrame]) => !collection || !["hustler", "gear"].includes(collection) || !timeFrame || !["daily", "weekly", "monthly"].includes(timeFrame),
    async execute(message, [collection, timeFrame]) {
        const fnMap = {
            "hustler": getHustlerStats,
            "gear": getGearStats
        }

        await fnMap[collection](message, timeFrame, collection[0].toUpperCase() + collection.slice(1));
    }
};

const getHustlerStats = async (message, timeFrame, type) => {
    const qxHustlerStats = await sfetch(quixoticHustlerStats, { headers: { "X-API-KEY": quixoticApiKey } });
    if (!qxHustlerStats) {
        return Promise.reject();
    }
    await chooseEmbed(message, timeFrame, qxHustlerStats, type);
}

const getGearStats = async (message, timeFrame, type) => {
    const qxGearStats = await sfetch(quixoticGearStats, { headers: { "X-API-KEY": quixoticApiKey } });
    if (!qxGearStats) {
        return Promise.reject();
    }
    await chooseEmbed(message, timeFrame, qxGearStats, type);
}

const chooseEmbed = async (message, timeFrame, data, type) => {
    const embedToSend = {
        "daily": sendDailyStatsEmbed,
        "weekly": sendWeeklyStatsEmbed,
        "monthly": sendMonthlyStatsEmbed
    }
    
    await embedToSend[timeFrame](message, data, type)
}


const sendDailyStatsEmbed = async (message, qxHustlerStats, type) => {
    const dailyStatsEmbed = getDailyMarketStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(quixoticCollectionLink)
        .setColor(qxRed)

    await message.channel.send({ embeds: [dailyStatsEmbed] });
}

const sendWeeklyStatsEmbed = async (message, qxHustlerStats, type) => {
    const weeklyStatsEmbed = getWeeklyMarketStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(quixoticCollectionLink)
        .setColor(qxRed)

    await message.channel.send({ embeds: [weeklyStatsEmbed] });
}

const sendMonthlyStatsEmbed = async (message, qxHustlerStats, type) => {
    const monthlyStatsEmbed = getMonthlyStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(quixoticCollectionLink)
        .setColor(qxRed)

    await message.channel.send({ embeds: [monthlyStatsEmbed] });
}

const { sfetch } = require('../../util/sfetch');
const { OS_API, OS_BLUE, OS_LINK, OS_SLUG } = require('../../constants');
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
    const osStats = await sfetch(`${OS_API}/collection/dope-v4/stats`);
    const dailyStatsEmbed = getDailyMarketStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(`${OS_LINK}/collection/${OS_SLUG}`)
        .setColor(OS_BLUE);
        
    await message.channel.send({ embeds: [dailyStatsEmbed] });
}


const weeklyOsStats = async (message) => {
    const osStats = await sfetch(`${OS_API}/collection/dope-v4/stats`);
    const weeklyStatsEmbed = getWeeklyMarketStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(`${OS_LINK}/collection/${OS_SLUG}`)
        .setColor(OS_BLUE);

    await message.channel.send({ embeds: [weeklyStatsEmbed] });
}

const monthlyOsStats = async (message) => {
    const osStats = await sfetch(`${OS_API}/collection/dope-v4/stats`);
    const monthlyStatsEmbed = getMonthlyStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(`${OS_LINK}/collection/${OS_SLUG}`)
        .setColor(OS_BLUE);

    await message.channel.send({ embeds: [monthlyStatsEmbed] });
}
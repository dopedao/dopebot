const { sfetch } = require('../../util/sfetch');
const { OS_API, OS_BLUE, OS_LINK, OS_SLUG } = require('../../constants');
const { getDailyMarketStatsEmbed, getWeeklyMarketStatsEmbed, getMonthlyStatsEmbed } = require('../../util/marketStatsEmbed');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("os")
        .setDescription("Shows various Dope OpenSea stats")
        .addSubcommand(subcommand =>
            subcommand.setName("daily")
            .setDescription("Daily OpenSea stats"))
        .addSubcommand(subcommand =>
            subcommand.setName("weekly")
            .setDescription("Weekly OpenSea stats"))
        .addSubcommand(subcommand =>
            subcommand.setName("monthly")
            .setDescription("Monthly OpenSea stats")),
    async execute(interaction) {
        const fnMap = {
            "daily": dailyOsStats,
            "weekly": weeklyOsStats,
            "monthly": monthlyOsStats
        }

        await fnMap[interaction.options.getSubcommand()](interaction);
    }
}

const dailyOsStats = async (interaction) => {
    const osStats = await sfetch(`${OS_API}/collection/dope-v4/stats`);
    const dailyStatsEmbed = getDailyMarketStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(`${OS_LINK}/collection/${OS_SLUG}`)
        .setColor(OS_BLUE);
        
    await interaction.reply({ embeds: [dailyStatsEmbed] });
}


const weeklyOsStats = async (interaction) => {
    const osStats = await sfetch(`${OS_API}/collection/dope-v4/stats`);
    const weeklyStatsEmbed = getWeeklyMarketStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(`${OS_LINK}/collection/${OS_SLUG}`)
        .setColor(OS_BLUE);

    await interaction.reply({ embeds: [weeklyStatsEmbed] });
}

const monthlyOsStats = async (interaction) => {
    const osStats = await sfetch(`${OS_API}/collection/dope-v4/stats`);
    const monthlyStatsEmbed = getMonthlyStatsEmbed(osStats.stats)
        .setTitle("⛵ **OpenSea Stats** - Dopes")
        .setURL(`${OS_LINK}/collection/${OS_SLUG}`)
        .setColor(OS_BLUE);

    await interaction.reply({ embeds: [monthlyStatsEmbed] });
}
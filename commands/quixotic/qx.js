const { sfetch } = require("../../util/sfetch");
const { QX_API, HUSTLER_CONTRACT, GEAR_CONTRACT, QX_LINK, QX_RED } = require("../../constants");
const { quixoticApiKey } = require("../../config.json");
const { getDailyMarketStatsEmbed, getWeeklyMarketStatsEmbed, getMonthlyStatsEmbed } = require("../../util/marketStatsEmbed");
const { SlashCommandBuilder } = require("@discordjs/builders");

const setContract = (type) => {
    return type == "Hustler" ? HUSTLER_CONTRACT : GEAR_CONTRACT;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("qx")
        .setDescription("Shows various Quixotic stats")
        .addSubcommand(subcommand =>
            subcommand.setName("hustler")
                .setDescription("Shows Hustler stats")
                .addStringOption(option =>
                    option.setName("timeframe")
                        .setDescription("Timeframe to show stats of")
                        .setRequired(true)
                        .addChoices(
                            { name: "Daily", value: "daily" },
                            { name: "Weekly", value: "weekly" },
                            { name: "Monthly", value: "monthly" }
                        )))

        .addSubcommand(subcommand =>
            subcommand.setName("gear")
                .setDescription("Shows Gear stats")
                .addStringOption(option =>
                    option.setName("timeframe")
                        .setDescription("Specify the timeframe")
                        .setRequired(true)
                        .addChoices(
                            { name: "Daily", value: "daily" },
                            { name: "Weekly", value: "weekly" },
                            { name: "Monthly", value: "monthly" }
                        ))),
    async execute(interaction) {
        const fnMap = {
            "hustler": getHustlerStats,
            "gear": getGearStats
        }

        await fnMap[interaction.options.getSubcommand()](interaction, interaction.options.getString("timeframe"), interaction.options.getSubcommand()[0].toUpperCase() + interaction.options.getSubcommand().slice(1));
    }
};

const getHustlerStats = async (interaction, timeFrame, type) => {
    const qxHustlerStats = await sfetch(`${QX_API}/collection/${HUSTLER_CONTRACT}/stats`, { headers: { "X-API-KEY": quixoticApiKey } });
    if (!qxHustlerStats) {
        return Promise.reject();
    }
    await chooseEmbed(interaction, timeFrame, qxHustlerStats, type);
}

const getGearStats = async (interaction, timeFrame, type) => {
    const qxGearStats = await sfetch(`${QX_API}/collection/${GEAR_CONTRACT}/stats`, { headers: { "X-API-KEY": quixoticApiKey } });
    if (!qxGearStats) {
        return Promise.reject();
    }
    await chooseEmbed(interaction, timeFrame, qxGearStats, type);
}

const chooseEmbed = async (interaction, timeFrame, data, type) => {
    const embedToSend = {
        "daily": sendDailyStatsEmbed,
        "weekly": sendWeeklyStatsEmbed,
        "monthly": sendMonthlyStatsEmbed
    }

    await embedToSend[timeFrame](interaction, data, type)
}


const sendDailyStatsEmbed = async (interaction, qxHustlerStats, type) => {
    const dailyStatsEmbed = getDailyMarketStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(`${QX_LINK}/collection/${setContract(type)}`)
        .setColor(QX_RED)

    await interaction.reply({ embeds: [dailyStatsEmbed] });
}

const sendWeeklyStatsEmbed = async (interaction, qxHustlerStats, type) => {
    const weeklyStatsEmbed = getWeeklyMarketStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(`${QX_LINK}/collection/${setContract(type)}`)
        .setColor(QX_RED)

    await interaction.reply({ embeds: [weeklyStatsEmbed] });
}

const sendMonthlyStatsEmbed = async (interaction, qxHustlerStats, type) => {
    const monthlyStatsEmbed = getMonthlyStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(`${QX_LINK}/collection/${setContract(type)}`)
        .setColor(QX_RED)

    await interaction.reply({ embeds: [monthlyStatsEmbed] });
}

import { sfetch } from "../../util/sfetch";
import { Constants } from "../../constants";
import { getDailyMarketStatsEmbed, getWeeklyMarketStatsEmbed, getMonthlyStatsEmbed } from "../../util/marketStatsEmbed";
import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ColorResolvable, CommandInteraction } from "discord.js";
import { IMarketStats } from "../../interfaces/IMarketStats";

const setContract = (type: string) => {
    return type == "Hustler" ? Constants.HUSTLER_CONTRACT : Constants.GEAR_CONTRACT;
}

export default {
    data: new SlashCommandBuilder()
        .setName("qx")
        .setDescription("Shows various Quixotic stats")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("hustler")
                .setDescription("Shows Hustler stats")
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("timeframe")
                        .setDescription("Timeframe to show stats of")
                        .setRequired(true)
                        .addChoices(
                            { name: "Daily", value: "daily" },
                            { name: "Weekly", value: "weekly" },
                            { name: "Monthly", value: "monthly" }
                        )))

        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("gear")
                .setDescription("Shows Gear stats")
                .addStringOption((option: SlashCommandStringOption) =>
                    option.setName("timeframe")
                        .setDescription("Specify the timeframe")
                        .setRequired(true)
                        .addChoices(
                            { name: "Daily", value: "daily" },
                            { name: "Weekly", value: "weekly" },
                            { name: "Monthly", value: "monthly" }
                        ))),
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const fnMap: { [name: string]: Function } = {
                "hustler": getHustlerStats,
                "gear": getGearStats
            }

            await fnMap[interaction.options.getSubcommand()!](interaction, interaction.options.getString("timeframe"), interaction.options.getSubcommand()[0].toUpperCase() + interaction.options.getSubcommand().slice(1));
        } catch (error: unknown) {
            return Promise.reject(error);
        }
    }
};

const getHustlerStats = async (interaction: CommandInteraction, timeFrame: string, type: string): Promise<void> => {
    try {
        const qxHustlerStats = await sfetch<IMarketStats>(`${Constants.QX_API}/collection/${Constants.HUSTLER_CONTRACT}/stats`, { headers: { "X-API-KEY": process.env.DBOT_QX_API_KEY } });
        await chooseEmbed(interaction, timeFrame, qxHustlerStats!, type);
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

const getGearStats = async (interaction: CommandInteraction, timeFrame: string, type: string): Promise<void> => {
    try {
        const qxGearStats = await sfetch<IMarketStats>(`${Constants.QX_API}/collection/${Constants.GEAR_CONTRACT}/stats`, { headers: { "X-API-KEY": process.env.DBOT_QX_API_KEY } });
        await chooseEmbed(interaction, timeFrame, qxGearStats!, type);
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

const chooseEmbed = async (interaction: CommandInteraction, timeFrame: string, data: IMarketStats, type: string): Promise<void> => {
    const embedToSend: { [name: string]: Function }= {
        "daily": sendDailyStatsEmbed,
        "weekly": sendWeeklyStatsEmbed,
        "monthly": sendMonthlyStatsEmbed
    }

    await embedToSend[timeFrame](interaction, data, type)
}


const sendDailyStatsEmbed = async (interaction: CommandInteraction, qxHustlerStats: IMarketStats, type: string): Promise<void> => {
    const dailyStatsEmbed = getDailyMarketStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(`${Constants.QX_LINK}/collection/${setContract(type)}`)
        .setColor(Constants.QX_RED as ColorResolvable)

    await interaction.reply({ embeds: [dailyStatsEmbed] });
}

const sendWeeklyStatsEmbed = async (interaction: CommandInteraction, qxHustlerStats: IMarketStats, type: string): Promise<void> => {
    const weeklyStatsEmbed = getWeeklyMarketStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(`${Constants.QX_LINK}/collection/${setContract(type)}`)
        .setColor(Constants.QX_RED as ColorResolvable)

    await interaction.reply({ embeds: [weeklyStatsEmbed] });
}

const sendMonthlyStatsEmbed = async (interaction: CommandInteraction, qxHustlerStats: IMarketStats, type: string): Promise<void> => {
    const monthlyStatsEmbed = getMonthlyStatsEmbed(qxHustlerStats.stats)
        .setTitle(`🔴✨ **Quixotic Stats** - ${type}`)
        .setURL(`${Constants.QX_LINK}/collection/${setContract(type)}`)
        .setColor(Constants.QX_RED as ColorResolvable)

    await interaction.reply({ embeds: [monthlyStatsEmbed] });
}

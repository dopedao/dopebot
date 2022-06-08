import { sfetch } from "../../util/sfetch";
import { ColorResolvable, CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { Constants } from "../../constants";
import { getDailyMarketStatsEmbed, getWeeklyMarketStatsEmbed, getMonthlyStatsEmbed } from "../../util/marketStatsEmbed";
import { IMarketStats } from "../../interfaces/IMarketStats";

export default {
    data: new SlashCommandBuilder()
        .setName("os")
        .setDescription("Shows various Dope OpenSea stats")
        .addStringOption((option: SlashCommandStringOption) =>
            option.setName("timeframe")
                .setDescription("Timeframe to show stats of")
                .setRequired(true)
                .addChoices(
                    { name: "Daily", value: "daily" },
                    { name: "Weekly", value: "weekly" },
                    { name: "Monthly", value: "monthly" }
                )),
    async execute(interaction: CommandInteraction) {
        try {
            const fnMap: any = {
                "daily": dailyOsStats,
                "weekly": weeklyOsStats,
                "monthly": monthlyOsStats
            }
            await fnMap[interaction.options.getString("timeframe")!](interaction);
        } catch (error: unknown) {
            return Promise.reject(error);
        }
    }
}

const dailyOsStats = async (interaction: CommandInteraction): Promise<void> => {
    try {
        const osStats = await sfetch<IMarketStats>(`${Constants.OS_API}/collection/dope-v4/stats`);
        const dailyStatsEmbed = getDailyMarketStatsEmbed(osStats?.stats)
            .setTitle("⛵ **OpenSea Stats** - Dopes")
            .setURL(`${Constants.OS_LINK}/collection/${Constants.OS_SLUG}`)
            .setColor(Constants.OS_BLUE as ColorResolvable);

        await interaction.reply({ embeds: [dailyStatsEmbed] });

    } catch (error: unknown) {
        return Promise.reject(error);
    }
}


const weeklyOsStats = async (interaction: CommandInteraction): Promise<void> => {
    try {
        const osStats = await sfetch<IMarketStats>(`${Constants.OS_API}/collection/dope-v4/stats`);
        const weeklyStatsEmbed = getWeeklyMarketStatsEmbed(osStats?.stats)
            .setTitle("⛵ **OpenSea Stats** - Dopes")
            .setURL(`${Constants.OS_LINK}/collection/${Constants.OS_SLUG}`)
            .setColor(Constants.OS_BLUE as ColorResolvable);

        await interaction.reply({ embeds: [weeklyStatsEmbed] });
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

const monthlyOsStats = async (interaction: CommandInteraction): Promise<void> => {
    try {
        const osStats = await sfetch<IMarketStats>(`${Constants.OS_API}/collection/dope-v4/stats`);
        const monthlyStatsEmbed = getMonthlyStatsEmbed(osStats?.stats)
            .setTitle("⛵ **OpenSea Stats** - Dopes")
            .setURL(`${Constants.OS_LINK}/collection/${Constants.OS_SLUG}`)
            .setColor(Constants.OS_BLUE as ColorResolvable);

        await interaction.reply({ embeds: [monthlyStatsEmbed] });
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

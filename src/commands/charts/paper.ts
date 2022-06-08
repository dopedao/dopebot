import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import { Constants } from "../../constants";
import { ICg_marketData } from "../../interfaces/Icg_paper";
import { createChart } from "../../util/chartRenderer";
import { sfetch } from "../../util/sfetch";
import { wrap } from "../../util/wrap";

export default {
    data: new SlashCommandBuilder()
        .setName("chart")
        .setDescription("Shows $PAPER chart")
        .addStringOption(option =>
            option.setName("chain")
                .setDescription("Chain to show paper chart of")
                .setRequired(true)
                .addChoices(
                    { name: "ETH Paper", value: "eth" },
                    { name: "BSC Paper", value: "bsc" }
                ))
        .addNumberOption(option =>
            option.setName("days")
            .setDescription("Specify how far back prices should be shown")
            .setMaxValue(1000)
            .setMinValue(0)),
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const fnMap: { [name: string]: Function } = {
                "eth": getEthChart,
                "bsc": getBscChart
            }
            await fnMap[interaction.options.getString("chain")!](interaction, interaction.options.getNumber("days") ?? 0.25);
        } catch (error: unknown) {
            return Promise.reject(error);
        }
    }
}

const getEthChart = async (interaction: CommandInteraction, days: number) => {
    try {
        const price_data = await sfetch<ICg_marketData>(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${Constants.PAPER_ETH_CONTRACT}/market_chart/?vs_currency=usd&days=${days}`);
        const tokenStats = await sfetch<IEthPaper>(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${Constants.PAPER_ETH_CONTRACT}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`);
        const tokenStatsRoot = tokenStats?.["0x7ae1d57b58fa6411f32948314badd83583ee0e8c"]
        const chartImage = await createChart(price_data!, "ETH $PAPER", days);
        const embed = createChartEmbed(tokenStatsRoot, "Paper-Eth / USD");
        const image = new MessageAttachment(chartImage, "chart.png");
        await interaction.reply({ embeds: [embed], files: [image] });

    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

const getBscChart = async (interaction: CommandInteraction, days: number) => {
    try {
        const price_data = await sfetch<ICg_marketData>(`https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${Constants.PAPER_BSC_CONTRACT}/market_chart/?vs_currency=usd&days=${days}`);
        const tokenStats = await sfetch<IBscPaper>(`https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${Constants.PAPER_BSC_CONTRACT}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`);
        const tokenStatsRoot = tokenStats?.["0xc28ea768221f67b6a1fd33e6aa903d4e42f6b177"];
        const chartImage = await createChart(price_data!, "BSC $PAPER", days);
        const embed = createChartEmbed(tokenStatsRoot, "Paper-BSC / USD");
        const image = new MessageAttachment(chartImage, "chart.png");
        await interaction.reply({ embeds: [embed], files: [image] });
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

const createChartEmbed = (tokenStatsRoot: any, title: string): MessageEmbed => {
        const embedColor = tokenStatsRoot?.usd_24h_change! < 0 ? "RED" : tokenStatsRoot?.usd_24h_change! > 0 ? "GREEN" : "ORANGE";
        const embed = new MessageEmbed()
            .setTitle(title)
            .setImage("attachment://chart.png")
            .setColor(embedColor as ColorResolvable)
            .addFields(
                { name: "💸 Price", value: `${wrap(`$${tokenStatsRoot?.usd!}`)}`, inline: true},
                { name: "📊 24h Price Change", value: `${wrap(`${tokenStatsRoot?.usd_24h_change.toFixed(2)}%`)}`, inline: true},
                // CG gives wrong vals? { name: "💰 Market Cap", value: `${wrap(`${currencyFormatter.format(tokenStatsRoot?.usd_market_cap!)}`)}`, inline: true},
                { name: "🏷️ 24h Volume", value: `${wrap(`${currencyFormatter.format(tokenStatsRoot?.usd_24h_vol!)}`)}`, inline: true},
                // Unnecessary? { name: "⏰ Last updated", value: `${wrap(`${moment.unix(tokenStatsRoot?.last_updated_at!).format("MM/DD/YYYY HH:mm:ss")}`)}`, inline: true}
            )

            return embed;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD"
})

interface IEthPaper {
    "0x7ae1d57b58fa6411f32948314badd83583ee0e8c": {
        usd: number,
        usd_market_cap: number,
        usd_24h_vol: number,
        usd_24h_change: number,
        last_updated_at: number

    }
}

interface IBscPaper {
    "0xc28ea768221f67b6a1fd33e6aa903d4e42f6b177": {
        usd: number,
        usd_market_cap: number,
        usd_24h_vol: number,
        usd_24h_change: number,
        last_updated_at: number

    }
}

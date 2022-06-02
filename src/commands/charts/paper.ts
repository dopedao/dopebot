import { SlashCommandBuilder } from "@discordjs/builders";
import { ChartConfiguration } from "chart.js";
import { ChartCallback, ChartJSNodeCanvas } from "chartjs-node-canvas";
import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import moment from "moment";
import Sharp from "sharp";
import { ICg_paper } from "../../interfaces/Icg_paper";
import { sfetch } from "../../util/sfetch";

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
        .addIntegerOption(option =>
            option.setName("days")
            .setDescription("Specify how far back prices should be shown")),
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const fnMap: { [name: string]: Function } = {
                "eth": getEthChart,
                "bsc": getBscChart
            }

            await fnMap[interaction.options.getString("chain")!](interaction, interaction.options.getNumber("days"));
        } catch (error: unknown) {
            console.log(error);
        }
    }
}

const getEthChart = async (interaction: CommandInteraction, days: number = 1) => {
    try {
        const price_data = await sfetch<ICg_paper>(`https://api.coingecko.com/api/v3/coins/ethereum/contract/0x7ae1d57b58fa6411f32948314badd83583ee0e8c/market_chart/?vs_currency=usd&days=${days}`);
        const times: string[] = [];
        for (let i = 0; i < price_data?.prices.length!; i++) {
            const timeStamp = price_data!.prices[i][0];
            const date = moment(timeStamp);
            times.push(date.format("DD-MM-YYYY-HH-MM-SS"));
        };


        const prices: number[] = [];
        for (let i = 0; i < price_data?.prices.length!; i++) {
            const price = price_data!.prices[i][1];
            prices.push(price);
        };

        const width = 600;
        const height = 300;
        const config: ChartConfiguration = {
            type: "line",
            data: {
                labels: times,
                datasets: [
                    {
                        data: prices,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        borderColor: "rgba(147, 250, 165, 1)",
                        borderWidth: 3,
                    }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 12
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: "BSC: PAPER/USD"
                    }
                },
            },
            plugins: [{
                id: '-colour',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save;
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, width, height);
                    ctx.restore();
                },
            }]
        };

        const chartCallback: ChartCallback = (ChartJS) => {
            ChartJS.defaults.responsive = true;
            ChartJS.defaults.maintainAspectRatio = false;
            ChartJS.defaults.color = 'white';
        }
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
        const chartFile = await chartJSNodeCanvas.renderToBuffer(config);
        const chartImage = Sharp(chartFile).png();
        const image = new MessageAttachment(chartImage, "chart.png");
        const embed = new MessageEmbed()
            .setTitle("Paper-ETH / USD")
            .setImage("attachment://chart.png")

        await interaction.reply({ embeds: [embed], files: [image] });

    } catch (error) {
        console.log(error);
    }
}

const getBscChart = async (interaction: CommandInteraction, days: number = 1) => {
    try {
        const price_data = await sfetch<ICg_paper>(`https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0xc28ea768221f67b6a1fd33e6aa903d4e42f6b177/market_chart/?vs_currency=usd&days=${days}`);
        const times: string[] = [];
        for (let i = 0; i < price_data?.prices.length!; i++) {
            const timeStamp = price_data!.prices[i][0];
            const date = moment(timeStamp);
            times.push(date.format("DD-MM-YYYY-HH-MM-SS"));
        };


        const prices: number[] = [];
        for (let i = 0; i < price_data?.prices.length!; i++) {
            const price = price_data!.prices[i][1];
            prices.push(price);
        };

        const width = 600;
        const height = 300;
        const config: ChartConfiguration = {
            type: "line",
            data: {
                labels: times,
                datasets: [
                    {
                        data: prices,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        borderColor: "rgba(147, 250, 165, 1)",
                        borderWidth: 3,
                    }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 12
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: "Eth: PAPER/USD"
                    }
                },
            },
            plugins: [{
                id: '-colour',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save;
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, width, height);
                    ctx.restore();
                },
            }]
        };

        const chartCallback: ChartCallback = (ChartJS) => {
            ChartJS.defaults.responsive = true;
            ChartJS.defaults.maintainAspectRatio = false;
            ChartJS.defaults.color = 'white';
        }
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
        const chartFile = await chartJSNodeCanvas.renderToBuffer(config);
        const chartImage = Sharp(chartFile).png();
        const image = new MessageAttachment(chartImage, "chart.png");
        const embed = new MessageEmbed()
            .setTitle("Paper-ETH / USD")
            .setImage("attachment://chart.png")

        await interaction.reply({ embeds: [embed], files: [image] });
    } catch (error) {
        console.log(error);
    }
}
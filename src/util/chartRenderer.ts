import { ChartConfiguration } from "chart.js"
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import moment from "moment";
import Sharp from "sharp";
import { ICg_marketData } from "../interfaces/Icg_paper";


export const createChart = async (price_data: ICg_marketData, pair_name: string, days: number): Promise<Sharp.Sharp> => {
        const dateFormat = setDateFormat(days);
        const times: string[] = [];
        for (let i = 0; i < price_data?.prices.length!; i++) {
            const timeStamp = price_data!.prices[i][0];
            const date = moment(timeStamp);
            times.push(date.format(dateFormat));
        };

        const prices: number[] = [];
        for (let i = 0; i < price_data?.prices.length!; i++) {
            const price = price_data!.prices[i][1];
            prices.push(price);
        };

        const volumes: number[] = [];
        for (let i = 0; i < price_data?.total_volumes.length!; i++) {
            const volume = price_data!.total_volumes[i][1];
            volumes.push(volume);
        };

        const width = 600;
        const height = 300;
        const config: ChartConfiguration= {
            type: "line",
            data: {
                labels: times,
                datasets: [
                    {
                        type: "line",
                        data: prices,
                        borderColor: "rgba(0, 160, 70, 0.8)",
                        borderWidth: 3,
                        yAxisID: "prices"
                    },
                    {
                        type: "line",
                        data: volumes,
                        backgroundColor: "rgba(230, 200, 20, 0.8)",
                        borderColor: "rgba(230, 200, 20, 0.8)",
                        borderWidth: 1,
                        yAxisID: "volumes",
                        
                    }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 12
                        }
                    },
                    prices: {
                        type: "linear",
                        display: true,
                        position: "right",
                        grid: {
                            color: "rgba(255, 255, 255, 0.6)"
                        },
                        ticks: {
                            maxTicksLimit: 8,
                            precision: 6
                        }
                    },
                    volumes: {
                        beginAtZero: true,
                        type: "linear",
                        display: false,
                        position: "left",
                        suggestedMin: 0,
                        suggestedMax: 500000,
                        grid: {
                            drawOnChartArea: false
                        },
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
                        align: "center",
                        display: true,
                        text: `${pair_name} | ${days} Day(s)`,
                        color: "rgba(255, 255, 255, 0.87)"
                    }
                },
                animation: false
            }
        };
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: "rgba(18, 18, 18, 1)" });
        const chartFile = await chartJSNodeCanvas.renderToBuffer(config);
        const chartImage = Sharp(chartFile).png();

        return chartImage;
}

const setDateFormat = (days: number): string => {
    switch (true) {
        case days < 1:
            return "HH:mm";
        case days > 1 && days <= 10:
            return "MM/DD";
        default:
            return "MM/DD/YYYY";
    }
}

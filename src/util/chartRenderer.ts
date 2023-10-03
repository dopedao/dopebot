import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import Sharp from 'sharp';
import ICgMarketData from '../interfaces/ICgMarketData';
import { logger } from './logger';
import dayjs from 'dayjs';

const log = logger('chart-render');

const colors = {
    price: 'rgba(0, 160, 70, 0.8)',
    volume: 'rgba(230, 200, 20, 0.8)',
    grid: 'rgba(255, 255, 255, 0.6)',
    title: 'rgba(255, 255, 255, 0.87)'
};

export const createChart = async (
    price_data: ICgMarketData,
    pair_name: string,
    days: number
): Promise<Sharp.Sharp> => {
    log.debug('Rendering chart...');
    const dateFormat = setDateFormat(days);
    const times: string[] = [];
    for (let i = 0; i < price_data?.prices.length!; i++) {
        const timeStamp = price_data!.prices[i][0];
        const date = dayjs(timeStamp);
        times.push(date.format(dateFormat));
    }

    const prices: number[] = [];
    for (let i = 0; i < price_data?.prices.length!; i++) {
        const price = price_data!.prices[i][1];
        prices.push(price);
    }

    const width = 600;
    const height = 300;
    const config: ChartConfiguration = {
        type: 'line',
        data: {
            labels: times,
            datasets: [
                {
                    type: 'line',
                    data: prices,
                    borderColor: colors.price,
                    borderWidth: 3,
                    yAxisID: 'prices'
                }
            ]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 12
                    }
                },
                prices: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        precision: 6
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    align: 'center',
                    display: true,
                    text: `${pair_name} | ${days} Day(s)`,
                    color: colors.title
                }
            },
            animation: false
        }
    };
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width,
        height,
        backgroundColour: 'rgba(18, 18, 18, 1)'
    });
    const chartFile = await chartJSNodeCanvas.renderToBuffer(config);
    const chartImage = Sharp(chartFile).png();
    log.debug('Finished');

    return chartImage;
};

const setDateFormat = (days: number): string => {
    switch (true) {
        case days < 1:
            return 'HH:mm';
        case days >= 1 && days <= 10:
            return 'MM/DD';
        default:
            return 'MM/DD/YYYY';
    }
};

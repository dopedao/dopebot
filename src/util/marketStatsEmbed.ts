import { wrap } from "./wrap";
import { MessageEmbed } from "discord.js";

const getChangeEmoji = (num: number) => {
    return num == 0 || !num ? "๐ธ" : num < 0 ? "๐ป" : "๐บ";
}

const ethDecimals = 4;
const volumeDecimals = 2;
const changeDecimals = 3;

export const getDailyMarketStatsEmbed = (stats: any): MessageEmbed => {
    return new MessageEmbed()
        .addFields(
            { name: `๐ฅ Daily Volume`, value: wrap(`${stats.one_day_volume.toFixed(ethDecimals)} ETH${getChangeEmoji(stats.one_day_change)}(${stats.one_day_change?.toFixed(changeDecimals) ?? 0})`), inline: true },
            { name: "๐ธ Sales", value: wrap(`${stats.one_day_sales}`), inline: true },
            { name: "๐ฌ Average Price", value: wrap(`${stats.one_day_average_price.toFixed(ethDecimals)} ETH`), inline: true },
            { name: "๐พ Total Sales", value: wrap(`${stats.total_sales}`), inline: true },
            { name: "๐ฅ Hodlers", value: wrap(`${stats.num_owners}`), inline: true },
            { name: "๐ท๏ธ Total Volume", value: wrap(`${stats.total_volume.toFixed(volumeDecimals)} ETH`), inline: true },
            { name: "๐งน Floor", value: wrap(`${stats.floor_price} ETH`), inline: true }
        )
        .setTimestamp();
}

export const getWeeklyMarketStatsEmbed = (stats: any): MessageEmbed => {
    return new MessageEmbed()
        .addFields(
            { name: `๐ฅ Weekly Volume`, value: wrap(`${stats.seven_day_volume.toFixed(ethDecimals)} ETH${getChangeEmoji(stats.seven_day_change)}(${stats.seven_day_change?.toFixed(changeDecimals) ?? 0})`), inline: true },
            { name: "๐ธ Sales", value: wrap(`${stats.seven_day_sales}`), inline: true },
            { name: "๐ฌ Average Price", value: wrap(`${stats.seven_day_average_price.toFixed(ethDecimals)} ETH`), inline: true },
            { name: "๐พ Total Sales", value: wrap(`${stats.total_sales}`), inline: true },
            { name: "๐ฅ Hodlers", value: wrap(`${stats.num_owners}`), inline: true },
            { name: "๐ท๏ธ Total Volume", value: wrap(`${stats.total_volume.toFixed(volumeDecimals)} ETH`), inline: true },
            { name: "๐งน Floor", value: wrap(`${stats.floor_price} ETH`), inline: true }
        )
        .setTimestamp();
}

export const getMonthlyStatsEmbed = (stats: any): MessageEmbed => {
    return new MessageEmbed()
        .addFields(
            { name: `๐ฅ Monthly Volume`, value: wrap(`${stats.thirty_day_volume.toFixed(ethDecimals)} ETH${getChangeEmoji(stats.thirty_day_change)}(${stats.thirty_day_change?.toFixed(changeDecimals) ?? 0})`), inline: true },
            { name: "๐ธ Sales", value: wrap(`${stats.thirty_day_sales}`), inline: true },
            { name: "๐ฌ Average Price", value: wrap(`${stats.thirty_day_average_price.toFixed(ethDecimals)} ETH`), inline: true },
            { name: "๐พ Total Sales", value: wrap(`${stats.total_sales}`), inline: true },
            { name: "๐ฅ Hodlers", value: wrap(`${stats.num_owners}`), inline: true },
            { name: "๐ท๏ธ Total Volume", value: wrap(`${stats.total_volume.toFixed(volumeDecimals)} ETH`), inline: true },
            { name: "๐งน Floor", value: wrap(`${stats.floor_price} ETH`), inline: true }
        )
        .setTimestamp();
}
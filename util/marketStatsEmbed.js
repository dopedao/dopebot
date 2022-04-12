const { MessageEmbed } = require("discord.js");
const { dWThumbnailPic } = require("../constants");
const { wrap } = require("./wrap");

const getChangeEmoji = (num) => {
    return num == 0 ? "🔸" : num < 0 ? "🔻" : "🔺";
}

const ethDecimals = 4;
const volumeDecimals = 2;
const changeDecimals = 3;

exports.getDailyMarketStatsEmbed = (stats) => {
    return new MessageEmbed()
        .addFields(
            { name: `🥇 Daily Volume`, value: wrap(`${stats.one_day_volume.toFixed(ethDecimals)} ETH${getChangeEmoji(stats.one_day_change)}(${stats.one_day_change.toFixed(changeDecimals)}%)`), inline: true },
            { name: "💸 Sales", value: wrap(`${stats.one_day_sales}`), inline: true },
            { name: "🚬 Average Price", value: wrap(`${stats.one_day_average_price.toFixed(ethDecimals)} ETH`), inline: true },
            { name: "🍾 Total Sales", value: wrap(`${stats.total_sales}`), inline: true },
            { name: "👥 Hodlers", value: wrap(`${stats.num_owners}`), inline: true },
            { name: "🏷️ Total Volume", value: wrap(`${stats.total_volume.toFixed(volumeDecimals)} ETH`), inline: true },
            { name: "🧹 Floor", value: wrap(`${stats.floor_price} ETH`), inline: true }
        )
        .setThumbnail(dWThumbnailPic)
        .setTimestamp();
}

exports.getWeeklyMarketStatsEmbed = (stats) => {
    return new MessageEmbed()
        .addFields(
            { name: `🥇 Weekly Volume`, value: wrap(`${stats.seven_day_volume.toFixed(ethDecimals)} ETH${getChangeEmoji(stats.seven_day_change)}(${stats.seven_day_change.toFixed(changeDecimals)}%)`), inline: true },
            { name: "💸 Sales", value: wrap(`${stats.seven_day_sales}`), inline: true },
            { name: "🚬 Average Price", value: wrap(`${stats.seven_day_average_price.toFixed(ethDecimals)} ETH`), inline: true },
            { name: "🍾 Total Sales", value: wrap(`${stats.total_sales}`), inline: true },
            { name: "👥 Hodlers", value: wrap(`${stats.num_owners}`), inline: true },
            { name: "🏷️ Total Volume", value: wrap(`${stats.total_volume.toFixed(volumeDecimals)} ETH`), inline: true },
            { name: "🧹 Floor", value: wrap(`${stats.floor_price} ETH`), inline: true }
        )
        .setThumbnail(dWThumbnailPic)
        .setTimestamp();
}

exports.getMonthlyStatsEmbed = (stats) => {
    return new MessageEmbed()
        .addFields(
            { name: `🥇 Monthly Volume`, value: wrap(`${stats.thirty_day_volume.toFixed(ethDecimals)} ETH${getChangeEmoji(stats.thirty_day_change)}(${stats.thirty_day_change.toFixed(changeDecimals)}%)`), inline: true },
            { name: "💸 Sales", value: wrap(`${stats.thirty_day_sales}`), inline: true },
            { name: "🚬 Average Price", value: wrap(`${stats.thirty_day_average_price.toFixed(ethDecimals)} ETH`), inline: true },
            { name: "🍾 Total Sales", value: wrap(`${stats.total_sales}`), inline: true },
            { name: "👥 Hodlers", value: wrap(`${stats.num_owners}`), inline: true },
            { name: "🏷️ Total Volume", value: wrap(`${stats.total_volume.toFixed(volumeDecimals)} ETH`), inline: true },
            { name: "🧹 Floor", value: wrap(`${stats.floor_price} ETH`), inline: true }
        )
        .setThumbnail(dWThumbnailPic)
        .setTimestamp();
}
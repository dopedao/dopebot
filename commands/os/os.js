const { MessageEmbed } = require('discord.js');
const { sfetch } = require('../../util/sfetch');
const { dWOpenSeaApiLink, dWThumbnailPic } = require('../../constants');
const { wrap } = require('../../util/wrap');

module.exports = {
    name: "os",
    description: "Shows OpenSea data",
    args: "[daily | weekly ]",
    validator: ([option]) => !option || !["daily", "weekly"].includes(option),
    async execute(message, [option]) {
        let embedToSend = {
            "daily" : await dailyOsStats(),
            "weekly" : await weeklyOsStats()
        };

        await message.channel.send({ embeds: [embedToSend[option]] })
    }
}

//TODO map resp to object and use embed template
const dailyOsStats = async () => {
        const osStats = await sfetch(dWOpenSeaApiLink);
        const dailyStatsEmbed = new MessageEmbed()
            .setTitle("⛵ **OpenSea Stats**")
            .setURL("https://opensea.io/collection/dope-v4")
            .setColor("#2081E2")
            .addFields(
                { name: "🥇 24h Volume", value: wrap(`${osStats.stats.one_day_volume.toFixed(4)} ETH`), inline: true },
                { name: "💸 Sales", value: wrap(`${osStats.stats.one_day_sales}`), inline: true },
                { name: "🚬 Average Price", value: wrap(`${osStats.stats.one_day_average_price.toFixed(4)} ETH`), inline: true },
                { name: "🍾 Total Sales", value: wrap(`${osStats.stats.total_sales}`), inline: true },
                { name: "👥 Hodlers", value: wrap(`${osStats.stats.num_owners}`), inline: true },
                { name: "🏷️ Market Cap", value: wrap(`${osStats.stats.market_cap.toFixed(2)} ETH`), inline: true },
                { name: "🧹 Floor", value: wrap(`${osStats.stats.floor_price} ETH`), inline: true }
            )
            .setThumbnail(dWThumbnailPic)
            .setTimestamp();
            
        return dailyStatsEmbed;
}

const weeklyOsStats = async () => {
        const osStats = await sfetch(dWOpenSeaApiLink);
        const weeklyStatsEmbed = new MessageEmbed()
            .setTitle("⛵ **OpenSea Stats**")
            .setURL("https://opensea.io/collection/dope-v4")
            .setColor("#2081E2")
            .addFields(
                { name: "🥇 7d Volume", value: wrap(`${osStats.stats.seven_day_volume.toFixed(4)} ETH`), inline: true },
                { name: "💸 Sales", value: wrap(`${osStats.stats.seven_day_sales}`), inline: true },
                { name: "🚬 Average Price", value: wrap(`${osStats.stats.seven_day_average_price.toFixed(4)} ETH`), inline: true },
                { name: "🍾 Total Sales", value: wrap(`${osStats.stats.total_sales}`), inline: true },
                { name: "👥 Hodlers", value: wrap(`${osStats.stats.num_owners}`), inline: true },
                { name: "🏷️ Market Cap", value: wrap(`${osStats.stats.market_cap.toFixed(2)} ETH`), inline: true },
                { name: "🧹 Floor", value: wrap(`${osStats.stats.floor_price} ETH`), inline: true }
            )
            .setThumbnail(dWThumbnailPic)
            .setTimestamp();
            
        return weeklyStatsEmbed;
}

const { MessageEmbed } = require('discord.js');
const { sfetch } = require('../../util/sfetch');
const { dWOpenSeaApiLink, dWThumbnailPic, osBlue, openseaCollectionLink } = require('../../constants');
const { wrap } = require('../../util/wrap');

module.exports = {
    name: "os",
    description: "\`daily\` - Shows daily OpenSea stats\n\`weekly\` - Shows weekly OpenSea stats",
    args: "[daily | weekly ]",
    validator: ([option]) => !option || !["daily", "weekly"].includes(option),
    async execute(message, [option]) {
        switch (option) {
            case "daily":
                await dailyOsStats(message);
                break;
            case "weekly":
                await weeklyOsStats(message);
                break;
            default:
                break;
        }
    }
}

const dailyOsStats = async (message) => {
    const ethPriceDecimals = 4;
    const osStats = await sfetch(dWOpenSeaApiLink);
    const dailyStatsEmbed = new MessageEmbed()
        .setTitle("⛵ **OpenSea Stats** - DopeWars")
        .setURL(openseaCollectionLink)
        .setColor(osBlue)
        .addFields(
            { name: "🥇 24h Volume", value: wrap(`${osStats.stats.one_day_volume.toFixed(ethPriceDecimals)} ETH`), inline: true },
            { name: "💸 Sales", value: wrap(`${osStats.stats.one_day_sales}`), inline: true },
            { name: "🚬 Average Price", value: wrap(`${osStats.stats.one_day_average_price.toFixed(ethPriceDecimals)} ETH`), inline: true },
            { name: "🍾 Total Sales", value: wrap(`${osStats.stats.total_sales}`), inline: true },
            { name: "👥 Hodlers", value: wrap(`${osStats.stats.num_owners}`), inline: true },
            { name: "🏷️ Market Cap", value: wrap(`${osStats.stats.market_cap.toFixed(2)} ETH`), inline: true },
            { name: "🧹 Floor", value: wrap(`${osStats.stats.floor_price} ETH`), inline: true }
        )
        .setThumbnail(dWThumbnailPic)
        .setTimestamp();
        
    await message.channel.send({ embeds: [dailyStatsEmbed] })
}

const weeklyOsStats = async (message) => {
    const osStats = await sfetch(dWOpenSeaApiLink);
    const weeklyStatsEmbed = new MessageEmbed()
        .setTitle("⛵ **OpenSea Stats** - DopeWars")
        .setURL(openseaCollectionLink)
        .setColor(osBlue)
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

    await message.channel.send({ embeds: [weeklyStatsEmbed] })
}

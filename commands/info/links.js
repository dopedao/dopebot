const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { DW_THUMBNAIL } = require("../../constants");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("links")
        .setDescription("Collection of helpful links"),
    async execute(interaction) {
        const linkEmbed = new MessageEmbed()
            .setTitle("Links")
            .setColor("PURPLE")
            .setFields(
                { name: "👥 Community", value:"[Discord](https://discord.com/invite/BhVrn4sWG2)\n[Twitter](https://twitter.com/TheDopeWars?s=20)\n[Telegram](https://t.me/DopeWarsPaper)", inline: true},
                { name: "\u200b", value: "\u200b", inline: true},
                { name: "🏦 DAO", value:"[Treasury](https://dope-wars.notion.site/Treasury-Info-9e36498c9c7f46e9a2aca1e52c0a0863) | [Contract](https://etherscan.io/address/0xb57ab8767cae33be61ff15167134861865f7d22c)\n[Proposals](https://dope-wars.notion.site/Voting-Proposals-085127e6e317467e87602e3ad47469bb)", inline: true},
                { name: "💸 Buy", value:"[$PAPER](https://www.coingecko.com/de/munze/dope-wars-paper)\n[Dope](https://dopewars.gg/swap-meet)\n[Hustlers](https://dopewars.gg/swap-meet/hustlers)\n[Gear](https://quixotic.io/collection/gear)", inline: true},
                { name: "\u200b", value: "\u200b", inline: true},
                { name: "📑 Guides", value:"[Dope](https://dope-wars.notion.site/DOPE-NFT-Rarity-Guide-aecf604653894d789899321cc7242775)\n[Hustlers](https://dope-wars.notion.site/Hustler-Guide-ad81eb1129c2405f8168177ba99774cf) | [OGs](https://dope-wars.notion.site/OG-Hustler-Guide-25c6dfb9dca64196aedf8def6297c51a)\n[Gear](https://dope-wars.notion.site/Dope-Gear-Guide-bab6001d5af2469f8790d8a1f156b3f4)\n[$PAPER](https://dope-wars.notion.site/PAPER-Token-Guide-beb98b5800404762968515b9b9aecf1e)\n[Swap Meet](https://dope-wars.notion.site/Swap-Meet-Guide-9d2f661813c44b1dbfe35c49eb89c59b)", inline: true},
            )
            .setThumbnail(DW_THUMBNAIL);

        await interaction.reply({ embeds: [linkEmbed] });
    }
};
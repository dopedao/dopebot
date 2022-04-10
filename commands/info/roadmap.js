const { MessageEmbed } = require("discord.js");
const { dWThumbnailPic } = require("../../constants");

module.exports = {
    name: "roadmap",
    description: `Tells you the roadmap`,
    async execute(message) {
        const roadmapEmbed = new MessageEmbed()
            .setTitle("Roadmap 🛣️")
            .setColor("YELLOW")
            .setFields(
                { name: "Dope NFT - Q3 2021 ✅", value: "\`8.000\` randomized, limited-edition [NFT bundles](https://opensea.io/collection/dope-v4) of **$PAPER** and **Gear** were released __September 2021__ during a fair-mint, costing only gas."},
                { name: "$PAPER - Q3 2021 ✅", value: "[Paper](https://www.coingecko.com/en/coins/dope-wars-paper) is an *Ethereum ERC-20 token* and the in-game currency of Dope Wars. **Paper** was originally distributed through a claimable amount of \`125.000\` per **Dope** NFT."},
                { name: "Gear - Q4 2021 ✅", value: "[Gear](https://dope-wars.notion.site/Dope-Gear-Guide-bab6001d5af2469f8790d8a1f156b3f4) are interchangeable pieces of equipment that live on the *L2 Optimism blockchain* as *ERC-1155 tokens*. They are created by Claiming an original **Dope** NFT."},
                { name: "Hustlers - Q4 2021 ✅", value: "[Hustlers](https://dope-wars.notion.site/dope-wars/Dope-Wiki-e237166bd7e6457babc964d1724befb2#d491a70fab074062b7b3248d6d09c06a) are bleeding edge, fully-customizable in-game characters and profile pictures created by Claiming **Gear** from an original **Dope** NFT then minting a **Hustler** NFT on the *Optimism L2 network* for low gas fees."},
                { name: "Mugshots - Q1 2022 ✅", value: "Dope Wars [Mugshots](https://community.dopewars.gg/mugshots) are photo snapshots of **Hustlers** from the Dope Wars metaverse represented as *ERC-721 tokens* on the *Ethereum Mainnet*."},
                { name: "Lunar New Year Airdrop - Q1 2022 ✅", value: "__February 1st__ - __February 15th__ we are celebrating the [Lunar New Year](https://dopewars.gg/lunar-new-year) with a free **Gear Accessory** drop from Chinatown. All **Hustlers** craeted before __January 31st 2022__ were eligible."},
                { name: "Dope Mix Volume 1 & Original Dope Wars EP - Q1 2022 ✅", value: "Famous DJ [Green Lantern](https://twitter.com/DJGREENLANTERN) dropped an exclusive original, certified [hip-hop mix](https://soundcloud.com/djgreenlantern/dj-green-lantern-dope-wars-mix) specifically made for Dope Wars. Currently, an original music EP is being produced with help from [Shecky Green](https://twitter.com/SheckyGreen) of The Source Magazine."},
                { name: "WEB3 Integration + More - Q1 2022", value: "Using your Dope Wars **Hustlers** as an in-game character, jump into the action on [Worldwide Webb](https://webb.game/) - an interoperable pixel metaverse."},
                { name: "P2E Game on Starknet - Q1-Q4 2022", value: "Inspired by the classic games of yesterday, we are adapting the classic gameplay of drug arbitrage and launching it all on the zero-knowledge proof blockchain [Starknet](https://starkware.co/starknet/)."},
                { name: "Swap Meet - Q2 2022", value: "Buy, sell, and trade **Dope**, **Hustlers**, **Gear**, and more on our Dope Wars Marketplace, or [Swap Meet](https://dopewars.gg/swap-meet)."},
                { name: "Turf - Q2 2022", value: "Stake your **Dope** and **Paper** tokens to earn **STREETCRED** - then use that to purchase our metaverse territories that will help you in game...with your **GANG**. Our [proposal](https://www.notion.so/dope-wars/DIP-24-The-Hustle-TURF-10be2b8155004341b13fa3c836d7daf7) allows for enhanced game mechanics and a blueprint of land ownership rights for the Dope Wars Metaverse."}
            )
            .setThumbnail(dWThumbnailPic)

        await message.channel.send({ embeds: [roadmapEmbed] });
    }
};
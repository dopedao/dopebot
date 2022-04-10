const { MessageEmbed } = require("discord.js");
const { osBlue, dWThumbnailPic } = require("../../constants");

module.exports = {
    name: "contribute",
    description: `Some helpful tips to contribute :)`,
    async execute(message) {
        const contributeEmbed = new MessageEmbed()
            .setTitle("How to contribute")
            .setColor(osBlue)
            .setDescription("The thing that makes the \`Dope\` community so amazing is taht the entire project is being built by the community. The \`Dope DAO's\` design intention was that anyone can build freely on top of it. It's an open ecosystem, by the people, for the people.")
            .setFields(
                { name: "Objectives 🎯", value: "[Link](https://dope-wars.notion.site/0ff426feb38d4bfa88c756f63d59f8f7?v=2cef1361705640d3a196d66a9d8c60b8)", inline: true},
                { name: "Tasks ✅", value: "[Link](https://dope-wars.notion.site/e21dd530d94e4420a1d7afdd40c8ed78?v=db96e8dc48e945f4a2c23bd64b22bc2b)", inline: true},
                { name: "3rd Party Contributor Material", value: "If you build a project on top of \`Dope\` that earns money or mints tokens, we ask that you send 5% of sales or tokens directly to the \`DAO\` treasury contract: [0xB57Ab8767CAe33bE61fF15167134861865F7D22C](https://etherscan.io/address/0xB57Ab8767CAe33bE61fF15167134861865F7D22C#readContract)\nThis allows us to help fund new artists, builders and community members to grow the \`Dope\` ecosystem and in turn, when they make money and are successful, they give back to the treasury so that we can help others."},
                { name: "⚡ Art + Branding Assets", value: "[Link](https://dope-wars.notion.site/e3cead8a67354029b20c80d76548fdcc?v=cb080eef3a0140989a4a026fa4399d5a)", inline: true},
                { name: "✨ App + Game Design Inspiration", value: "[Link](https://dope-wars.notion.site/App-Game-Design-Inspiration-b54779d1a0bc461d8838534797cc855a)", inline: true},
                { name: "🤸 Character + Copy Style Guide", value: "[Link](https://dope-wars.notion.site/Character-Copy-Style-Guide-Copy-54fbf798c4c340b2aef1999e6ad7e671)", inline: true},
                { name: "🎨 Design Style Guide", value: "[Link](https://dope-wars.notion.site/Design-Style-Guide-60d4bdf736994a2094ce253739a1adb3)", inline: true},
            )
            .setThumbnail(dWThumbnailPic);

        await message.channel.send({ embeds: [contributeEmbed] });
    }
};
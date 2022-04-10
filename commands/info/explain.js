const { MessageEmbed, MessageAttachment } = require("discord.js");
const Sharp = require("sharp");
const { osBlue, qxRed, hustlerGif } = require("../../constants");

module.exports = {
    name: "explain",
    description: `\`Explains what each term stands for\``,
    args: "[dope | claimed | opened | hustler | OGs | gear | turf]",
    validator: ([option]) => !option || !["dope", "claimed", "opened", "hustler", "gear", "turf", "ogs"].includes(option),
    async execute(message, [option]) {
        switch (option) {
            case "dope":
                await explainDope(message);
                break;
            case "claimed":
                await explainClaimed(message);
                break;
            case "opened":
                await explainOpened(message);
                break;
            case "hustler":
                await explainHustler(message);
                break;
            case "gear":
                await explainGear(message);
                break;
            case "turf":
                await explainTurf(message);
                break;
            case "ogs":
                await explaingOgs(message);
                break;
            default:
                await message.channel.send(`${option} has not been implemented yet :((`);
                break;
        }
    }
};

const explainDope = async (message) => {
    const dopeImage = Sharp('./images/dope.svg').png();
    const imageFile = new MessageAttachment(dopeImage, "dope.png");

    const dopeEmbed = new MessageEmbed()
        .setTitle("What is a \"Dope\"❓")
        .setColor(osBlue)
        .setImage("attachment://dope.png")
        .setDescription("A limited-edition of 8.000 **DOPE NFTs** were created in September 2021. These **DOPE NFTs** contain eight pieces of wearable equipment with randomized attributes, rarity scores and one vehicle. Each **DOPE NFT** allows you to \"Claim **Paper**\", \"Claim **Gear**\" and \"Initiate a **Hustler**\", only *once* to be used in-game, while also providing an equal **Governance Vote** on [Proposals](https://dope-wars.notion.site/626df3ff9e4d47da98ea23abc4b6e7a7) from the **DAO**. The **DOPE NFT** will server as a \"Dope Pass\" for future additions to the game and metaverse, including eligibility for future airdops, staking and features.");

    message.channel.send({ embeds: [dopeEmbed], files: [imageFile] });
}

const explainClaimed = async (message) => {
    const claimedEmbed = new MessageEmbed()
        .setTitle("What does \"Claimed\" mean❓")
        .setColor(osBlue);

    message.channel.send({ embeds: [claimedEmbed] });
}

const explainOpened = async (message) => {
    const openedEmbed = new MessageEmbed()
        .setTitle("What does \"Opened\" mean❓")
        .setColor(qxRed);

    message.channel.send({ embeds: [openedEmbed] });
}

const explainHustler = async (message) => {
    const hustlerEmbed = new MessageEmbed()
        .setTitle("What is a \"Hustler\"❓")
        .setColor(qxRed)
        .setDescription("Hustlers are the in-game and in-ecosystem characters in the Dope Wars universer. Hustlers undergo a process of initiation, or character customization, prior to mint. This can be done using the [swap meet](https://dopewars.gg/swap-meet).")
        .setImage(hustlerGif);

    message.channel.send({ embeds: [hustlerEmbed] });
}

const explaingOgs = async (message) => {
    const ogImage = Sharp("./images/og.svg").png();
    const imageFile = new MessageAttachment(ogImage, "og.png");

    const ogsEmbed = new MessageEmbed()
        .setTitle("What are \"OGs\"❓")
        .setColor(qxRed)
        .setDescription("OGs are a limited set of **500** OG Hustlers, which were initiated and minted in November 2021. OGs have maxed 100 **RESPECT**, can have exclusive **ALIEN SKIN** and will be able to form **GANGS** in the upcoming game.")
        .setImage("attachment://og.png")

    await message.channel.send({ embeds: [ogsEmbed], files: [imageFile] });
}

const explainGear = async (message) => {
    const gearImage = Sharp('./images/tricycle.svg').png();
    const imageFile = new MessageAttachment(gearImage, "gear.png");

    const gearEmbed = new MessageEmbed()
        .setTitle("What is \"Gear\"❓")
        .setColor(qxRed)
        .setImage("attachment://gear.png")
        .setDescription("Dope Gear is any individual piece that can be equipped on a Hustler. Hustlers have 10 slots for Dope Gear. Each piece of Dope Gear exists on the L2 Optimistic Ethereum Blockchain, just like your hustler.")

    message.channel.send({ embeds: [gearEmbed], files: [imageFile] });
}

const explainTurf = async (message) => {
    const imageFile = new MessageAttachment("./images/turf.png", "turf.png");

    const turfEmbed = new MessageEmbed()
        .setTitle("What is \"Turf\"❓")
        .setColor("YELLOW")
        .setDescription("Turf refers to Dope Wars **Territories**, an expansion of DOPE, which is designed to act as a location lego for the Dope Wars ecosystem. It uses the existing DOPE item locations for Cities values, while providing more granular locations by also including Districts, Hoods and Plots")
        .setImage("attachment://turf.png");

    await message.channel.send({ embeds: [turfEmbed], files: [imageFile] });
}
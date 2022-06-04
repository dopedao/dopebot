import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { MessageEmbed, MessageAttachment, ColorResolvable, CommandInteraction } from "discord.js";
import Sharp from "sharp";
import { Constants } from "../../constants";

export default {
    data: new SlashCommandBuilder()
        .setName("explain")
        .setDescription("Explains each term")
        .addStringOption((option: SlashCommandStringOption) =>
            option.setName("term")
            .setDescription("Term to explain")
            .setRequired(true)
            .addChoices(
                { name: "Dope", value: "dope"},
                { name: "Hustler", value: "hustler"},
                { name: "Gear", value: "gear"},
                { name: "Turf", value: "turf"},
                { name: "OGs", value: "ogs"},
                { name: "Paper", value: "paper"}
            )),
    async execute(interaction: CommandInteraction): Promise<void> {
        const fnMap: { [name: string]: Function }= {
            "dope": explainDope,
            "hustler": explainHustler,
            "gear": explainGear,
            "turf": explainTurf,
            "ogs": explaingOgs,
            "paper": explainPaper
        }

        await fnMap[interaction.options.getString("term")!](interaction);
    }
};

const explainDope = async (interaction: CommandInteraction): Promise<void> => {
    const dopeImage = Sharp('./images/dope.svg').png();
    const imageFile = new MessageAttachment(dopeImage, "dope.png");

    const dopeEmbed = new MessageEmbed()
        .setTitle("What is a \"Dope\"❓")
        .setColor(Constants.OS_BLUE as ColorResolvable)
        .setImage("attachment://dope.png")
        .setDescription("A limited-edition of \`8.000\` **Dope NFTs** were created in __September 2021__. These **Dope NFTs** contain eight pieces of wearable equipment with randomized attributes, rarity scores and one vehicle. Each **Dope NFT** allows you to \"Claim **Paper**\", \"Claim **Gear**\" and \"Initiate a **Hustler**\", only **once** to be used in-game, while also providing an equal **Governance Vote** on [Proposals](https://dope-wars.notion.site/626df3ff9e4d47da98ea23abc4b6e7a7) from the **DAO**. The **Dope NFT** will serve as a **Dope Pass** for future additions to the game and metaverse, including eligibility for future airdops, staking and features.");

    await interaction.reply({ embeds: [dopeEmbed], files: [imageFile] });
}

const explainHustler = async (interaction: CommandInteraction): Promise<void> => {
    const hustlerEmbed = new MessageEmbed()
        .setTitle("What is a \"Hustler\"❓")
        .setColor(Constants.QX_RED as ColorResolvable)
        .setDescription("**Hustlers** are the in-game and in-ecosystem characters in the Dope Wars universe. **Hustlers** undergo a process of initiation, or character customization, prior to mint. This can be done using the [Swap Meet](https://dopewars.gg/swap-meet).")
        .setImage(Constants.HUSTLER_GIF);

    await interaction.reply({ embeds: [hustlerEmbed] });
}

const explaingOgs = async (interaction: CommandInteraction): Promise<void> => {
    const ogImage = Sharp("./images/og.svg").png();
    const imageFile = new MessageAttachment(ogImage, "og.png");

    const ogsEmbed = new MessageEmbed()
        .setTitle("What are \"OGs\"❓")
        .setColor(Constants.QX_RED as ColorResolvable)
        .setDescription("**OGs** are a limited set of \`500\` **OG Hustlers**, which were initiated and minted in __November 2021__. **OGs** have maxed \`100\` **Respect**, can have exclusive **Alien Skin** and will be able to form **Gangs** in the upcoming game.")
        .setImage("attachment://og.png")

    await interaction.reply({ embeds: [ogsEmbed], files: [imageFile] });
}

const explainGear = async (interaction: CommandInteraction): Promise<void> => {
    const gearImage = Sharp('./images/tricycle.svg').png();
    const imageFile = new MessageAttachment(gearImage, "gear.png");

    const gearEmbed = new MessageEmbed()
        .setTitle("What is \"Gear\"❓")
        .setColor(Constants.QX_RED as ColorResolvable)
        .setImage("attachment://gear.png")
        .setDescription("Dope **Gear** is any individual piece that can be equipped on a **Hustler**. Hustlers have 10 slots for **Dope Gear**. Each piece of **Dope Gear** exists on the *L2 Optimistic Ethereum Blockchain*, just like your **Hustler**.")

    await interaction.reply({ embeds: [gearEmbed], files: [imageFile] });
}

const explainTurf = async (interaction: CommandInteraction): Promise<void> => {
    const imageFile = new MessageAttachment("./images/turf.png", "turf.png");

    const turfEmbed = new MessageEmbed()
        .setTitle("What is \"Turf\"❓")
        .setColor("YELLOW")
        .setDescription("**Turf** refers to Dope Wars **Territories**, an expansion of **Dope**, which is designed to act as a location lego for the Dope Wars ecosystem. It uses the existing **Dope** item locations for Cities values, while providing more granular locations by also including Districts, Hoods and Plots")
        .setImage("attachment://turf.png");

    await interaction.reply({ embeds: [turfEmbed], files: [imageFile] });
}

const explainPaper = async (interaction: CommandInteraction): Promise<void> => {
    const gifFile = new MessageAttachment("./images/paper-animate.gif", "paper.gif");

    const paperEmbed = new MessageEmbed()
        .setTitle("What is \"$PAPER\"❓")
        .setColor("GREEN")
        .setDescription("**$PAPER** is an *Ethereum ERC-20 token* and the in-game currency of Dope Wars. It was originally distributed through a claimable amount of \`125.000\` per Dope NFT and has a fixed supply of \`1 billion\`.")
        .setImage("attachment://paper.gif")

    await interaction.reply({ embeds: [paperEmbed], files: [gifFile]});
}
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Sharp = require("sharp");
const { osBlue, qxRed, hustlerGif } = require("../../constants");

module.exports = {
    name: "explain",
    description: `\`Explains what each term stands for\``,
    args: "[dope | claimed | opened | hustler | gear | turf]",
    validator: ([option]) => !option || !["dope", "claimed", "opened", "hustler", "gear", "turf"].includes(option),
    async execute(message, [option]) {
        switch(option) {
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
        .setImage("attachment://dope.png");

    
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
        .setImage(hustlerGif);

    message.channel.send({ embeds: [hustlerEmbed] });
}

const explainGear = async (message) => {
    const gearImage = Sharp('./images/tricycle.svg').png();
    const imageFile = new MessageAttachment(gearImage, "gear.png");

    const gearEmbed = new MessageEmbed()
        .setTitle("What is \"Gear\"❓")
        .setColor(qxRed)
        .setImage("attachment://gear.png");

    message.channel.send({ embeds: [gearEmbed], files: [imageFile] });
}

const explainTurf = async (message) => {
    const imageFile = new MessageAttachment("./images/turf.png", "turf.png");

    const turfEmbed = new MessageEmbed()
        .setTitle("What is \"Turf\"❓")
        .setColor("YELLOW")
        .setImage("attachment://turf.png");

    await message.channel.send({ embeds: [turfEmbed], files: [imageFile]});
}
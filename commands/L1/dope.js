const { MessageEmbed } = require('discord.js');
const { dWApi, dwApiEthConvValue, dWThumbnailPic } = require('../../constants');
const { dopeInvQuery, dopeStatusQuery } = require('../../Queries/dopeQueries');
const { default: request } = require('graphql-request');

module.exports = {
    name: "dope",
    description: `\`inv\` - Outputs the dope's inv\n\`check\` - Checks the dope's status\n\`all\` - Executes all available commands`,
    args: "[inv | check | all] (1-8000)",
    validator: ([option, id]) => !option || !["inv", "check", "all"].includes(option) || !parseInt(id) || 0 > parseInt(id) > 8000,
    async execute(message, [option, id]) {
        let embedToSend = {
            "inv": await getDopeInvEmbed(id),
            "check": await getDopeCheckEmbed(id),
            "all": await getAllDopeEmbeds(id)
        }

        await message.channel.send("Loading...").then(m => m.edit(embedToSend[option]));
    }
};

dopeObject = {
    neck: null,
    ring: null,
    clothes: null,
    hand: null,
    waist: null,
    weapon: null,
    foot: null,
    drugs: null,
    vehicle: null,
    accessory: null
}

const getAllDopeEmbeds = async (id) => {
    const invEmbed = await getDopeInvEmbed(id);
    const checkEmbed = await getDopeCheckEmbed(id);

    return { embeds: [invEmbed.embeds[0], checkEmbed.embeds[0]] };
}

const getDopeInvEmbed = async (id) => {
    const dope = await request(dWApi, dopeInvQuery, { "where": { "id": id } });
    if (!dope) {
        return Promise.reject()
    }
    const dopeRoot = dope.dopes.edges[0].node;
    const lastSale = dopeRoot?.listings[0]?.inputs[0]?.amount;
    const dopeMap = new Map(Object.entries(dopeRoot.items));

    for (const keypair of dopeMap) {
        dopeObject[keypair[1].type.toLowerCase()] = keypair[1].fullname;
    }

    const dopeInventoryEmbed = new MessageEmbed()
        .setTitle(`Dope #${id} Inventory`)
        .setColor("#2081E2")
        .setFields(
            { name: "⛓️ Neck", value: `${dopeObject.neck}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "💍 Ring", value: `${dopeObject.ring}`, inline: true },
            { name: "🦺 Clothes", value: (`${dopeObject.clothes}`), inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🥊 Hand", value: `${dopeObject.hand}`, inline: true },
            { name: "🩲 Waist", value: `${dopeObject.waist}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🗡️ Weapon", value: `${dopeObject.weapon}`, inline: true },
            { name: "👞 Foot", value: `${dopeObject.foot}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🐊 Drugs", value: `${dopeObject.drugs}`, inline: true },
            { name: "🚓 Vehicle", value: `${dopeObject.vehicle}`, inline: false },
            { name: "💸 Last sale", value: `${lastSale ? `\`${lastSale / dwApiEthConvValue} ETH\`` : "none"}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "⛵ OpenSea", value: `[Listing](https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${id})`, inline: true },
        )
        .setThumbnail(dWThumbnailPic);

    return { embeds: [dopeInventoryEmbed] }
}

const getDopeCheckEmbed = async (id) => {
    const dope = await request(dWApi, dopeStatusQuery, { "where": { "id": id } });
    if (!dope) {
        return Promise.reject()
    }
    const dopeRoot = dope.dopes.edges[0].node;

    const claimed = dopeRoot.claimed ? '✅' : '❌';
    const opened = dopeRoot.opened ? '✅' : '❌';
    const color = dopeRoot.claimed && dopeRoot.opened ? "GREEN" : !dopeRoot.claimed && !dopeRoot.opened ? "RED" : "ORANGE";

    const dopeCheckEmbed = new MessageEmbed()
        .setTitle(`Dope #${id} Status`)
        .setColor(color)
        .setDescription(
            `**Claimed:** ${claimed}\n` +
            `**Opened:** ${opened}\n`
        )
        .setTimestamp()

    return { embeds: [dopeCheckEmbed] }
}

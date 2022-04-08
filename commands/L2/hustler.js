const { MessageEmbed, MessageAttachment } = require('discord.js');
const { dWApi, dWThumbnailPic, quixoticCollectionLink } = require('../../constants');
const { hustlerQuery, hustlerImageQuery, hustlerTotalCountQuery } = require('../../Queries/hustlerQueries');
const { svgRenderer } = require('../../util/svgRenderer');
const { default: request } = require('graphql-request');

module.exports = {
    name: "hustler",
    description: `\`inv\` - Outputs the hustler's inv\n\`img\` - Shows the rendered hustler\n\`all\` - Executes all available commands`,
    //Fetch totalCount and store in memory to dynamically update?
    args: `[inv | img | all] (1-1600)`,
    validator: ([option, id]) => !option || !["inv", "img", "all"].includes(option) || !parseInt(id),
    async execute(message, [option, id]) {
        const hustlerCount = await getTotalHustlerCount();
        if (parseInt(id) > hustlerCount) {
            const invalidIdEmbed = new MessageEmbed()
                .setTitle("⚠️")
                .setColor("YELLOW")
                .setDescription(`Please provide an id between 0 - ${hustlerCount}`);

            await message.channel.send({ embeds: [invalidIdEmbed] });
            return;
        }

        let embedToSend = {
            "inv": await getHustlerInvEmbed(id),
            "img": await getHustlerImgEmbed(id),
            "all": await getAllHustlerEmbeds(id)
        };

        await message.channel.send("Loading...").then(m => m.edit(embedToSend[option]));
    }
};

hustlerObject = {
    neck: null,
    ring: null,
    clothes: null,
    hand: null,
    waist: null,
    weapon: null,
    foot: null,
    drug: null,
    vehicle: null,
    accessory: null,
    type: null,
    name: null,
    type: null,
    title: null
}

const getTotalHustlerCount = async () => {
    const hustlerCountRes = await request(dWApi, hustlerTotalCountQuery);
    if (!hustlerCountRes?.hustlers?.totalCount) {
        return Promise.reject()
    }

    return hustlerCountRes.hustlers.totalCount;
}

const getAllHustlerEmbeds = async (id) => {
    const invEmbed = await getHustlerInvEmbed(id);
    const imgEmbed = await getHustlerImgEmbed(id);

    return { embeds: [invEmbed.embeds[0], imgEmbed.embeds[0]], files: [imgEmbed.files[0]] };
}

const getHustlerImgEmbed = async (id) => {
    const hustler = await request(dWApi, hustlerImageQuery, { "where": { "id": id } });
    if (!hustler?.hustlers?.edges[0]) {
        return Promise.reject();
    }
    const hustlerRoot = hustler.hustlers.edges[0].node;
    const hustlerPng = await svgRenderer(hustlerRoot.svg);
    const discImage = new MessageAttachment(hustlerPng, "hustler.png");

    const hustlerPictureEmbed = new MessageEmbed()
        .setTitle(`${hustlerRoot.name} : ${hustlerRoot.title}`)
        .setImage("attachment://hustler.png")
        .setColor("#FF0420")
        .setTimestamp();

    return { embeds: [hustlerPictureEmbed], files: [discImage] };
}

const getHustlerInvEmbed = async (id) => {
    const hustler = await request(dWApi, hustlerQuery, { "where": { "id": id } });
    if (!hustler?.hustlers?.edges[0]?.node) {
        return Promise.reject();
    }
    const hustlerRoot = hustler.hustlers.edges[0].node;
    const hustlerMap = new Map(Object.entries(hustlerRoot));

    for (const keypair of hustlerMap) {
        hustlerObject[keypair[0]] = keypair[1]?.fullname ?? keypair[1];
    }

    const hustlerInvEmbed = new MessageEmbed()
        .setTitle(`Hustler #${id} Inventory`)
        .setColor("#FF0420")
        .setDescription(`**Name:** \`${hustlerObject.name}\`\n**Title:** \`${hustlerObject.title}\`\n**Type:** \`${hustlerObject.type}\``)
        .setFields(
            { name: "⛓️ Neck", value: `${hustlerObject.neck}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "💍 Ring", value: `${hustlerObject.ring}`, inline: true },
            { name: "🦺 Clothes", value: `${hustlerObject.clothes}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🥊 Hand", value: `${hustlerObject.hand}`, inline: true },
            { name: "🩲 Waist", value: `${hustlerObject.waist}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🗡️ Weapon", value: `${hustlerObject.weapon}`, inline: true },
            { name: "👞 Foot", value: `${hustlerObject.foot}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🐊 Drug", value: `${hustlerObject.drug}`, inline: true },
            { name: "🚓 Vehicle", value: `${hustlerObject.vehicle}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🎭 Accessory", value: `${hustlerObject.accessory ?? 'none :('}`, inline: true },
            { name: "🔴✨ Quixotic", value: `[Listing](${quixoticCollectionLink}/${id})`, inline: true }
        )
        .setThumbnail(dWThumbnailPic);

    return { embeds: [hustlerInvEmbed] };
}
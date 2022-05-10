const { MessageEmbed, MessageAttachment } = require('discord.js');
const { DW_GRAPHQL_API, DW_THUMBNAIL, QX_LINK, HUSTLER_CONTRACT } = require('../../constants');
const { hustlerQuery, hustlerImageQuery, hustlerTotalCountQuery } = require('../../Queries/hustlerQueries');
const { svgRenderer } = require('../../util/svgRenderer');
const { default: request } = require('graphql-request');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hustler")
        .setDescription("Gives various hustler info")
        .addSubcommand(subcommand =>
            subcommand.setName("inv")
            .setDescription("Outputs the inv")
            .addIntegerOption(option =>
                option.setName("hustlerid")
                .setDescription("Specify the id")
                .setMinValue(0)
                .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand.setName("img")
            .setDescription("Shows your hustler")
            .addIntegerOption(option =>
                option.setName("hustlerid")
                .setDescription("Specify the id")
                .setMinValue(0)
                .setRequired(true))),
    async execute(interaction) {
        const hustlerCount = await getTotalHustlerCount();
        if (interaction.options.getInteger("hustlerid") > hustlerCount - 1) {
            const invalidIdEmbed = new MessageEmbed()
                .setTitle("⚠️")
                .setColor("YELLOW")
                .setDescription(`Please provide an id between 0 - ${hustlerCount - 1}`);

            await interaction.reply({ embeds: [invalidIdEmbed] });
            return;
        }

        const fnMap = {
            "inv": getHustlerInvEmbed,
            "img": getHustlerImgEmbed
        }
        const id = interaction.options.getInteger("hustlerid");
        await fnMap[interaction.options.getSubcommand()](interaction, id);
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
    const hustlerCountRes = await request(DW_GRAPHQL_API, hustlerTotalCountQuery);
    if (!hustlerCountRes?.hustlers?.totalCount) {
        return Promise.reject()
    }

    return hustlerCountRes.hustlers.totalCount;
}

const getHustlerImgEmbed = async (interaction, id) => {
    const hustler = await request(DW_GRAPHQL_API, hustlerImageQuery, { "where": { "id": id } });
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

    await interaction.reply({ embeds: [hustlerPictureEmbed], files: [discImage] });
}

const getHustlerInvEmbed = async (interaction, id) => {
    const hustler = await request(DW_GRAPHQL_API, hustlerQuery, { "where": { "id": id } });
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
        .setDescription(`${setField("**Name:**", hustlerObject.name)}${setField("**Title:**", hustlerObject.title)}${setField("**Type:**", hustlerObject.type)}`)
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
            { name: "🔴✨ Quixotic", value: `[Listing](${QX_LINK}/asset/${HUSTLER_CONTRACT}/${id})`, inline: true }
        )
        .setThumbnail(DW_THUMBNAIL);
    
    await interaction.reply({ embeds: [hustlerInvEmbed]});
}


const setField = (name, obj) => {
    return obj ? `${name} \`${obj}\`\n` : '';
}
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { dWApi } = require('../../constants');
const { hustlerQuery, hustlerImageQuery, hustlerTotalCountQuery } = require('../../Queries/hustlerQueries');
const { fillHustlerEmbed } = require('../../util/hustler/fillHustlerInvEmbed');
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
    const hustler = await request(dWApi, hustlerQuery, { "where": { "id": id}});
    if (!hustler?.hustlers?.edges[0]?.node) {
        return Promise.reject();
    }
    const hustlerInvEmbed = fillHustlerEmbed(hustler, id);

    return { embeds: [hustlerInvEmbed] };
}
const { MessageEmbed } = require('discord.js');
const { sfetch } = require('../../util/sfetch');
const { dWApi } = require('../../constants');
const { dopeInvQuery, dopeStatusQuery } = require('../../Queries/dopeQueries');
const { fillDopeInvEmbed } = require('../../util/dope/dopeInvEmbed');

module.exports = {
    name: "dope",
    description: `\`inv\` - Outputs the dope's inv\n\`check\` - Checks the dope's status\n\`all\` - Executes all available commands`,
    args: "[inv | check | all] (1-8000)",
    validator: ([option, id]) => !option || !["inv", "check", "all"].includes(option) || !parseInt(id) || 0 > parseInt(id) > 8000,
    async execute(message, [option, id]) {
        let embedToSend = {
           "inv" : await getDopeInvEmbed(id),
            "check" : await getDopeCheckEmbed(id),
            "all" : await getAllDopeEmbeds(id)
        }

        await message.channel.send(embedToSend[option]);
    }
};

const getAllDopeEmbeds = async (id) => {
    const invEmbed = await getDopeInvEmbed(id);
    const checkEmbed = await getDopeCheckEmbed(id);

    return { embeds: [invEmbed.embeds[0], checkEmbed.embeds[0]] };
}

const getDopeInvEmbed = async (id) => {
    const dope = await sfetch(dWApi, { method: "POST", body: dopeInvQuery(id), headers: { "content-type": "application/json"} })
    if (!dope) {
        return Promise.reject()
    }
    const dopeInventoryEmbed = fillDopeInvEmbed(dope, id);

    return { embeds: [dopeInventoryEmbed] }
}

const getDopeCheckEmbed = async (id) => {
    const dope = await sfetch(dWApi, { method: "POST", body: dopeStatusQuery(id), headers: { "content-type": "application/json" } });
    if (!dope) {
        return Promise.reject()
    }
    const dopeRoot = dope.data.dopes.edges[0].node;

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

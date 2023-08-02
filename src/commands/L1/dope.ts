import request from "graphql-request";
import { SlashCommandIntegerOption, SlashCommandSubcommandBuilder, SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { AttachmentBuilder, CacheType, ChatInputCommandInteraction, Colors, CommandInteraction } from "discord.js";
import { Constants } from "../../constants";
import { dopeQueries } from "../../Queries/dopeQueries";
import { IDope } from "../../interfaces/IDope";

export default {
    data: new SlashCommandBuilder()
        .setName("dope")
        .setDescription("Dope commands")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("inv")
                .setDescription("Outputs the inv")
                .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option.setName("dopeid")
                        .setDescription("Id of Dope to print inventory of")
                        .setMinValue(1)
                        .setMaxValue(8000)
                        .setRequired(true)))

        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("check")
                .setDescription("Checks the claim status")
                .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option.setName("dopeid")
                        .setDescription("Id of Dope to check")
                        .setMinValue(1)
                        .setMaxValue(8000)
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const fnMap: { [name: string]: Function } = {
                "inv": getDopeInvEmbed,
                "check": getDopeCheckEmbed
            }
            const id = interaction.options.getInteger("dopeid");
            await fnMap[interaction.options.getSubcommand()](interaction, id);
        } catch(error: unknown) {
            return Promise.reject(error);
        }
    }
};

const getDopeInvEmbed = async (interaction: ChatInputCommandInteraction, id: number): Promise<void> => {
    try {
        const dope = await request<IDope>(Constants.DW_GRAPHQL_API, dopeQueries.dopeInvQuery, { "where": { "id": id } });
        const dopeRoot = dope.dopes.edges[0].node;
        const lastSale = dopeRoot.listings[0]?.inputs[0]?.amount / Constants.dwApiEthConvValue;
        const dopeMap = new Map(Object.entries(dopeRoot.items));
        let dopeObject: { [key: string]: string } = {};

        for (const keypair of dopeMap) {
            dopeObject[keypair[1].type.toLowerCase()] = keypair[1].fullname;
        }

        const dopeInventoryEmbed = new EmbedBuilder()
            .setTitle(`Dope #${id} Inventory (Rank: ${dopeRoot.rank})`)
            .setColor(0x2081E2)
            .setFields(
                { name: `⛓️ Neck | ${dopeRoot.items[7].tier}`, value: `${dopeObject.neck}`, inline: true },
                { name: `\u200b`, value: "\u200b", inline: true },
                { name: `💍 Ring | ${dopeRoot.items[5].tier}`, value: `${dopeObject.ring}`, inline: true },
                { name: `🦺 Clothes | ${dopeRoot.items[1].tier}`, value: (`${dopeObject.clothes}`), inline: true },
                { name: `\u200b`, value: "\u200b", inline: true },
                { name: `🥊 Hand | ${dopeRoot.items[4].tier}`, value: `${dopeObject.hand}`, inline: true },
                { name: `🩲 Waist | ${dopeRoot.items[2].tier}`, value: `${dopeObject.waist}`, inline: true },
                { name: `\u200b`, value: "\u200b", inline: true },
                { name: `🗡️ Weapon | ${dopeRoot.items[0].tier}`, value: `${dopeObject.weapon}`, inline: true },
                { name: `👞 Foot | ${dopeRoot.items[3].tier}`, value: `${dopeObject.foot}`, inline: true },
                { name: `\u200b`, value: "\u200b", inline: true },
                { name: `🐊 Drugs | ${dopeRoot.items[6].tier}`, value: `${dopeObject.drugs}`, inline: true },
                { name: `🚓 Vehicle | ${dopeRoot.items[8].tier}`, value: `${dopeObject.vehicle}`, inline: false },
                { name: `💸 Last sale`, value: `${isNaN(lastSale) ? "none" : lastSale}`, inline: true },
                { name: `\u200b`, value: "\u200b", inline: true },
                { name: `⛵ OpenSea`, value: `[Listing](https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${id})`, inline: true },
            )
            .setThumbnail(Constants.DW_THUMBNAIL);

        await interaction.reply({ embeds: [dopeInventoryEmbed] });
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

const getDopeCheckEmbed = async (interaction: ChatInputCommandInteraction, id: number): Promise<void> => {
    try {
        const dope = await request<IDope>(Constants.DW_GRAPHQL_API, dopeQueries.dopeStatusQuery, { "where": { "id": id } });
        const dopeRoot = dope.dopes.edges[0].node;

        const claimed = !dopeRoot.claimed ? '✅' : '❌';
        const opened = !dopeRoot.opened ? '✅' : '❌';
        const fullyClaimed = dopeRoot.claimed && dopeRoot.opened;
        const color = fullyClaimed ? Colors.Green : !dopeRoot.claimed && !dopeRoot.opened ? Colors.Red : Colors.Orange;

        const dopeCheckEmbed = new EmbedBuilder()
            .setTitle(`Dope #${id} Status`)
            .setColor(color)
            .setDescription(
                `**Can Claim $PAPER:** ${claimed}\n` +
                `**Can Claim Gear:** ${opened}\n`
            )
            .setTimestamp()

        if (fullyClaimed) {
            const claimedImage = new AttachmentBuilder("./images/vote_female.png")
                .setName("vote_female.png")
            dopeCheckEmbed.setImage("attachment://vote_female.png")
            dopeCheckEmbed.setDescription("This **Dope NFT** has been \`fully claimed\`.\nIt serves as a DAO voting token, and will be eligible for future airdrops.")

            await interaction.reply({ embeds: [dopeCheckEmbed], files: [claimedImage] });
            return;
        }

        await interaction.reply({ embeds: [dopeCheckEmbed] });
    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

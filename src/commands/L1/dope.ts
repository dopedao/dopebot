import request from "graphql-request";
import { SlashCommandIntegerOption, SlashCommandSubcommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageAttachment, CacheType, CommandInteraction } from "discord.js";
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
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const fnMap: { [name: string]: Function }= {
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

const getDopeInvEmbed = async (interaction: CommandInteraction<CacheType>, id: number): Promise<void> => {
    try {
        const dope = await request<IDope>(Constants.DW_GRAPHQL_API, dopeQueries.dopeInvQuery, { "where": { "id": id } });
        const dopeRoot = dope.dopes.edges[0].node;
        const lastSale = dopeRoot.listings![0].inputs![0].amount!;
        const dopeMap = new Map(Object.entries(dopeRoot.items!));
        let dopeObject: { [key: string]: string } = {};

        for (const keypair of dopeMap) {
            dopeObject[keypair[1].type!.toLowerCase()] = keypair[1].fullname!;
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
                { name: "💸 Last sale", value: `${lastSale ? `\`${lastSale / Constants.dwApiEthConvValue} ETH\`` : "none"}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "⛵ OpenSea", value: `[Listing](https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${id})`, inline: true },
            )
            .setThumbnail(Constants.DW_THUMBNAIL);

        await interaction.reply({ embeds: [dopeInventoryEmbed] });

        /*
        for (const keypair of dopeMap) {
            dopeObject[keypair[1].type.toLowerCase()] = keypair[1];
        }
    
        const dopeRarityEmbed = new MessageEmbed()
            .setTitle(`Dope #${id} Rarities`)
            .setColor(osBlue)
            .setFields(
                { name: `⛓️ Neck`, value: `\`${dopeObject.neck.fullname}\`\n**${dopeObject.neck.tier}**\nCount: \`${dopeObject.neck.count}\``, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: `💍 Ring`, value: `\`${dopeObject.ring.fullname}\`\n**${dopeObject.ring.tier}**\nCount: \`${dopeObject.ring.count}\``, inline: true },
                { name: `🦺 Clothes`, value: `\`${dopeObject.clothes.fullname}\`\n**${dopeObject.clothes.tier}**\nCount: \`${dopeObject.clothes.count}\``, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: `🥊 Hand`, value: `\`${dopeObject.hand.fullname}\`\n**${dopeObject.hand.tier}**\nCount: \`${dopeObject.hand.count}\``, inline: true },
                { name: `🩲 Waist`, value: `\`${dopeObject.waist.fullname}\`\n**${dopeObject.waist.tier}**\nCount: \`${dopeObject.waist.count}\``, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: `🗡️ Weapon`, value: `\`${dopeObject.weapon.fullname}\`\n**${dopeObject.weapon.tier}**\nCount: \`${dopeObject.weapon.count}\``, inline: true },
                { name: `👞 Foot`, value: `\`${dopeObject.foot.fullname}\`\n**${dopeObject.foot.tier}**\nCount: \`${dopeObject.foot.count}\``, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: `🐊 Drugs`, value: `\`${dopeObject.drugs.fullname}\`\n**${dopeObject.drugs.tier}**\nCount: \`${dopeObject.drugs.count}\``, inline: true },
                { name: `🚓 Vehicle`, value: `\`${dopeObject.vehicle.fullname}\`\n**${dopeObject.vehicle.tier}**\nCount: \`${dopeObject.vehicle.count}\``, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "💸 Last sale", value: `${lastSale ? `\`${lastSale / dwApiEthConvValue} ETH\`` : "none"}`, inline: true },
                { name: "\u200b", value: "\u200b", inline: true },
                { name: "⛵ OpenSea", value: `[Listing](https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${id})`, inline: true },
            )
            .setThumbnail(dWThumbnailPic);
    
        await message.channel.send({ embeds: [dopeRarityEmbed] });
        */

    } catch (error: unknown) {
        return Promise.reject(error);
    }
}

const getDopeCheckEmbed = async (interaction: CommandInteraction, id: number): Promise<void> => {
    try {
        const dope = await request<IDope>(Constants.DW_GRAPHQL_API, dopeQueries.dopeStatusQuery, { "where": { "id": id } });
        const dopeRoot = dope.dopes.edges[0].node;

        const claimed = !dopeRoot.claimed ? '✅' : '❌';
        const opened = !dopeRoot.opened ? '✅' : '❌';
        const fullyClaimed = dopeRoot.claimed && dopeRoot.opened;
        const color = fullyClaimed ? "GREEN" : !dopeRoot.claimed && !dopeRoot.opened ? "RED" : "ORANGE";

        const dopeCheckEmbed = new MessageEmbed()
            .setTitle(`Dope #${id} Status`)
            .setColor(color)
            .setDescription(
                `**Can Claim $PAPER:** ${claimed}\n` +
                `**Can Claim Gear:** ${opened}\n`
            )
            .setTimestamp()

        if (fullyClaimed) {
            const claimedImage = new MessageAttachment("./images/vote_female.png", "vote_female.png")
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

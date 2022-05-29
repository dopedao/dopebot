import { hustlerQueries } from "../../Queries/hustlerQueries";
import { svgRenderer } from "../../util/svgRenderer";
import { MessageEmbed, MessageAttachment, CommandInteraction } from "discord.js";
import { Constants } from "../../constants";
import request from "graphql-request";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("hustler")
        .setDescription("Gives various hustler info")
        .addSubcommand(subcommand =>
            subcommand.setName("inv")
            .setDescription("Outputs the inv")
            .addIntegerOption(option =>
                option.setName("hustlerid")
                .setDescription("Id of the Hustler")
                .setMinValue(0)
                .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand.setName("img")
            .setDescription("Shows your hustler")
            .addIntegerOption(option =>
                option.setName("hustlerid")
                .setDescription("Id of the Hustler")
                .setMinValue(0)
                .setRequired(true))),
    async execute(interaction: CommandInteraction): Promise<void> {
        const hustlerCount = await getTotalHustlerCount();
        if (interaction.options.getInteger("hustlerid")!> hustlerCount - 1) {
            const invalidIdEmbed = new MessageEmbed()
                .setTitle("⚠️")
                .setColor("YELLOW")
                .setDescription(`Please provide an id between 0 - ${hustlerCount - 1}`);

            return await interaction.reply({ embeds: [invalidIdEmbed] });
        }

        const fnMap: any = {
            "inv": getHustlerInvEmbed,
            "img": getHustlerImgEmbed
        }
        const id = interaction.options.getInteger("hustlerid");
        await fnMap[interaction.options.getSubcommand()](interaction, id);
    }
};

const getTotalHustlerCount = async (): Promise<number> => {
    const hustlerCountRes = await request(Constants.DW_GRAPHQL_API, hustlerQueries.hustlerTotalCountQuery) as Hustler;
    if (!hustlerCountRes?.hustlers?.totalCount) {
        return Promise.reject()
    }

    return hustlerCountRes.hustlers.totalCount;
}

const getHustlerImgEmbed = async (interaction: CommandInteraction, id: number): Promise<void> => {
    const hustler = await request(Constants.DW_GRAPHQL_API, hustlerQueries.hustlerImageQuery, { "where": { "id": id } }) as Hustler;
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

interface Hustler {
    hustlers: {
        totalCount: number,
        edges: Edge[]
    }
};

interface Edge {
    node: {
        name: string,
        type: string,
        title: string,
        svg: string,
        neck: {
            fullname: string
        },
        ring: {
            fullname: string
        },
        accessory: {
            fullname: string
        },
        drug: {
            fullname: string
        },
        hand: {
            fullname: string
        },
        weapon: {
            fullname: string
        },
        clothes: {
            fullname: string
        }, 
        vehicle: {
            fullname: string
        },
        waist: {
            fullname: string
        },
        foot: {
            fullname: string
        }
    }
};


const getHustlerInvEmbed = async (interaction: CommandInteraction, id: number): Promise<void> => {
    const hustler = await request(Constants.DW_GRAPHQL_API, hustlerQueries.hustlerQuery, { "where": { "id": id } }) as Hustler;
    if (!hustler?.hustlers?.edges[0]?.node) {
        return Promise.reject();
    }
    const hustlerRoot = hustler.hustlers.edges[0].node;

    const hustlerInvEmbed = new MessageEmbed()
        .setTitle(`Hustler #${id} Inventory`)
        .setColor("#FF0420")
        .setDescription(`${setField("**Name:**", hustlerRoot.name)}${setField("**Title:**", hustlerRoot.title)}${setField("**Type:**", hustlerRoot.type)}`)
        .setFields(
            { name: "⛓️ Neck", value: `${ hustlerRoot.neck}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "💍 Ring", value: `${ hustlerRoot.ring}`, inline: true },
            { name: "🦺 Clothes", value: `${ hustlerRoot.clothes}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🥊 Hand", value: `${ hustlerRoot.hand}`, inline: true },
            { name: "🩲 Waist", value: `${ hustlerRoot.waist}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🗡️ Weapon", value: `${ hustlerRoot.weapon}`, inline: true },
            { name: "👞 Foot", value: `${ hustlerRoot.foot}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🐊 Drug", value: `${ hustlerRoot.drug}`, inline: true },
            { name: "🚓 Vehicle", value: `${ hustlerRoot.vehicle}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🎭 Accessory", value: `${ hustlerRoot.accessory ?? 'none :('}`, inline: true },
            { name: "🔴✨ Quixotic", value: `[Listing](${Constants.QX_LINK}/asset/${Constants.HUSTLER_CONTRACT}/${id})`, inline: true }
        )
        .setThumbnail(Constants.DW_THUMBNAIL);
    
    await interaction.reply({ embeds: [hustlerInvEmbed]});
}


const setField = (name: string, obj: string): string => obj ? `${name} \`${obj}\`\n` : ''
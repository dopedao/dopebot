import { hustlerQueries } from '../../Queries/hustlerQueries';
import { svgRenderer } from '../../util/svgRenderer';
import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    Colors
} from 'discord.js';
import { Constants } from '../../constants';
import request from 'graphql-request';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { IHustler } from '../../interfaces/IHustler';

export default {
    data: new SlashCommandBuilder()
        .setName('hustler')
        .setDescription('Gives various hustler info')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('inv')
                .setDescription('Outputs the inv')
                .addIntegerOption((option) =>
                    option
                        .setName('hustlerid')
                        .setDescription('Id of the Hustler')
                        .setMinValue(0)
                        .setRequired(true)
                )
        )

        .addSubcommand((subcommand) =>
            subcommand
                .setName('img')
                .setDescription('Shows your hustler')
                .addIntegerOption((option) =>
                    option
                        .setName('hustlerid')
                        .setDescription('Id of the Hustler')
                        .setMinValue(0)
                        .setRequired(true)
                )
        ),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const hustlerCount = await getTotalHustlerCount();
            if (
                interaction.options.getInteger('hustlerid')! >
                hustlerCount - 1
            ) {
                const invalidIdEmbed = new EmbedBuilder()
                    .setTitle('⚠️')
                    .setColor(Colors.Yellow)
                    .setDescription(
                        `Please provide an id between 0 - ${hustlerCount - 1}`
                    );

                await interaction.reply({ embeds: [invalidIdEmbed] });
                return;
            }

            const fnMap: { [name: string]: Function } = {
                inv: getHustlerInvEmbed,
                img: getHustlerImgEmbed
            };
            const id = interaction.options.getInteger('hustlerid');
            await fnMap[interaction.options.getSubcommand()](interaction, id);
        } catch (error: unknown) {
            return Promise.reject(error);
        }
    }
};

const getTotalHustlerCount = async (): Promise<number> => {
    try {
        const hustlerCountRes = await request<IHustler>(
            Constants.DW_GRAPHQL_API,
            hustlerQueries.hustlerTotalCountQuery
        );
        return hustlerCountRes.hustlers.totalCount;
    } catch (error: unknown) {
        return Promise.reject(error);
    }
};

const getHustlerImgEmbed = async (
    interaction: ChatInputCommandInteraction,
    id: number
): Promise<void> => {
    try {
        const hustler = await request<IHustler>(
            Constants.DW_GRAPHQL_API,
            hustlerQueries.hustlerImageQuery,
            { where: { id: id } }
        );
        if (!hustler?.hustlers?.edges[0]) {
            return Promise.reject();
        }
        const hustlerRoot = hustler.hustlers.edges[0].node;
        const hustlerPng = await svgRenderer(hustlerRoot.svg);
        const discImage = new AttachmentBuilder(hustlerPng, {
            name: 'hustler.png'
        });

        const hustlerPictureEmbed = new EmbedBuilder()
            .setTitle(`${hustlerRoot.name} : ${hustlerRoot.title}`)
            .setImage('attachment://hustler.png')
            .setColor(0xff0420)
            .setTimestamp();

        await interaction.reply({
            embeds: [hustlerPictureEmbed],
            files: [discImage]
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

const getHustlerInvEmbed = async (
    interaction: ChatInputCommandInteraction,
    id: number
): Promise<void> => {
    try {
        const hustler = await request<IHustler>(
            Constants.DW_GRAPHQL_API,
            hustlerQueries.hustlerQuery,
            { where: { id: id } }
        );
        const hustlerRoot = hustler.hustlers.edges[0].node;

        const hustlerInvEmbed = new EmbedBuilder()
            .setTitle(`Hustler #${id} Inventory`)
            .setColor(0xff0420)
            .setDescription(
                `${setField('**Name:**', hustlerRoot.name)}${setField(
                    '**Title:**',
                    hustlerRoot.title
                )}${setField('**Type:**', hustlerRoot.type)}`
            )
            .setFields(
                {
                    name: '⛓️ Neck',
                    value: `${hustlerRoot.neck.fullname}`,
                    inline: true
                },
                { name: '\u200b', value: '\u200b', inline: true },
                {
                    name: '💍 Ring',
                    value: `${hustlerRoot.ring.fullname}`,
                    inline: true
                },
                {
                    name: '🦺 Clothes',
                    value: `${hustlerRoot.clothes.fullname}`,
                    inline: true
                },
                { name: '\u200b', value: '\u200b', inline: true },
                {
                    name: '🥊 Hand',
                    value: `${hustlerRoot.hand.fullname}`,
                    inline: true
                },
                {
                    name: '🩲 Waist',
                    value: `${hustlerRoot.waist.fullname}`,
                    inline: true
                },
                { name: '\u200b', value: '\u200b', inline: true },
                {
                    name: '🗡️ Weapon',
                    value: `${hustlerRoot.weapon.fullname}`,
                    inline: true
                },
                {
                    name: '👞 Foot',
                    value: `${hustlerRoot.foot.fullname}`,
                    inline: true
                },
                { name: '\u200b', value: '\u200b', inline: true },
                {
                    name: '🐊 Drug',
                    value: `${hustlerRoot.drug.fullname}`,
                    inline: true
                },
                {
                    name: '🚓 Vehicle',
                    value: `${hustlerRoot.vehicle.fullname}`,
                    inline: true
                },
                { name: '\u200b', value: '\u200b', inline: true },
                {
                    name: '🎭 Accessory',
                    value: `${hustlerRoot?.accessory?.fullname ?? 'none :('}`,
                    inline: true
                },
                {
                    name: '🔴✨ Quixotic',
                    value: `[Listing](${Constants.QX_LINK}/asset/${Constants.HUSTLER_CONTRACT}/${id})`,
                    inline: true
                }
            )
            .setThumbnail(Constants.DW_THUMBNAIL);

        await interaction.reply({ embeds: [hustlerInvEmbed] });
    } catch (error: unknown) {
        return Promise.reject(error);
    }
};

const setField = (name: string, obj: string): string =>
    obj ? `${name} \`${obj}\`\n` : '';

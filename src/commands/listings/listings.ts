import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder
} from '@discordjs/builders';
import {
    CommandInteraction,
    CacheType,
    GuildMemberRoleManager,
    ChatInputCommandInteraction
} from 'discord.js';
import moment from 'moment';

export default {
    data: new SlashCommandBuilder()
        .setName('listings')
        .setDescription('Variety of commands to administer listing messages')
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('mute')
                .setDescription(
                    'Mutes a certain dope from showing in listings for X days'
                )
                .addNumberOption((option) =>
                    option
                        .setName('dopeid')
                        .setDescription('Id of the dope to mute')
                        .setMinValue(1)
                        .setMaxValue(8000)
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('days')
                        .setDescription(
                            'Amount of days you want to mute the dopeid'
                        )
                        .setMinValue(1)
                        .setMaxValue(10)
                        .setRequired(true)
                )
        )

        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('unmute')
                .setDescription('Unmutes a previously muted dope')
                .addNumberOption((option) =>
                    option
                        .setName('dopeid')
                        .setDescription('Id of the dope to unmute')
                        .setMinValue(1)
                        .setMaxValue(8000)
                        .setRequired(true)
                )
        )

        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName('view').setDescription('Shows all muted dopes')
        ),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (
            (interaction.member?.roles as GuildMemberRoleManager).highest
                .position <
            interaction.guild?.roles.cache.find(
                (roles) => roles.name == 'facilitator'
            )?.position!
        ) {
            interaction.reply('Insufficient permissions.');
        }

        const fnMap: { [name: string]: Function } = {
            mute: muteDope,
            unmute: unmuteDope,
            view: viewMutedDopes
        };
        const id = interaction.options.getNumber('dopeid');
        const duration = interaction.options.getNumber('days');
        await fnMap[interaction.options.getSubcommand()](
            interaction,
            id,
            duration
        );
    }
};

export interface MutedDope {
    id: number;
    endDate: number;
}

export let mutedDopes: MutedDope[] = [];

export const isMuted = (dopeId: number) => {
    if (mutedDopes.some((x) => x.id == dopeId)) {
        const possiblyMutedIndex = mutedDopes.findIndex((x) => x.id == dopeId);
        const possiblyMutedDope = mutedDopes[possiblyMutedIndex];
        const now = moment.now();

        if (now - possiblyMutedDope.endDate > 0) {
            return true;
        }
        return false;
    }
};

const muteDope = async (
    interaction: CommandInteraction<CacheType>,
    dopeId: number,
    duration: number
) => {
    if (mutedDopes.some((x) => x.id == dopeId)) {
        await interaction.reply('Already muted dope#' + dopeId);
        return;
    }

    const dur = moment.duration(duration, 'days');
    mutedDopes.push({
        id: dopeId,
        endDate: dur.asMilliseconds()
    });

    await interaction.reply('Muted dope#' + dopeId);
};

const unmuteDope = async (
    interaction: CommandInteraction<CacheType>,
    dopeId: number,
    duration: number
) => {
    if (!mutedDopes.some((x) => x.id == dopeId)) {
        await interaction.reply('Dope #' + dopeId + ' not found');
        return;
    }

    mutedDopes = mutedDopes.filter((x) => x.id != dopeId);
    await interaction.reply('Unmuted dope#' + dopeId);
};

const viewMutedDopes = async (
    interaction: CommandInteraction<CacheType>,
    dopeId: number,
    duration: number
) => {
    if (mutedDopes.length <= 0) {
        await interaction.reply('No dopes muted');
        return;
    }

    const muted = mutedDopes.map((x) => x.id).toString();
    await interaction.reply('Muted dopes: ' + muted);
};

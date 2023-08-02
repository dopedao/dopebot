import { CommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { ICommandCollectionClient } from '../interfaces/ICommandCollectionClient';
import { logger } from '../util/logger';

const log = logger('slashcommand');
const minRole = 'verified';

export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            if (!interaction.isCommand()) return;
            if (
                (interaction.member?.roles as GuildMemberRoleManager).highest
                    .position <
                interaction.guild?.roles.cache.find(
                    (roles) => roles.name == minRole
                )?.position!
            ) {
                await interaction.reply(
                    `You are missing the required role: ${minRole}`
                );
                return;
            }

            const command = (
                interaction.client as ICommandCollectionClient
            ).commands!.get(interaction.commandName);
            if (!command) return;

            log.info(
                `${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.user.id}) executed ${interaction.commandName}`
            );
            await command.execute(interaction);
        } catch (error: unknown) {
            if (error instanceof Error) {
                log.error(error.stack);
            } else {
                log.error(error);
            }
            await interaction.reply(
                'There was an error executing the command.'
            );
        }
    }
};

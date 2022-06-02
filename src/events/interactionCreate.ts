import { GuildMemberRoleManager, Interaction } from "discord.js";
import { ICommandCollectionClient } from "../interfaces/ICommandCollectionClient";
import { logger } from "../util/logger";

const log = logger("slashcommand");

export default {
    name: "interactionCreate",
    once: false,
    async execute(interaction: Interaction): Promise<void> {

        if (!interaction.isCommand()
        || (interaction.member!.roles as GuildMemberRoleManager).cache.find((role: any) => role.name === "packing heat")!.position > (interaction.member!.roles as GuildMemberRoleManager).highest.position) {
                return;
        }

        const command = (interaction.client as ICommandCollectionClient).commands!.get(interaction.commandName);
        if (!command) return;

        try {
                log.info(`${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.user.id}) executed ${interaction.commandName}`)
                await command.execute(interaction);
        } catch(error: unknown) {
                if (error instanceof Error) {
                        log.error(error);
                        await interaction.reply("There was an error executing the command");
                }
        }
    }
}
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, InteractionResponseType } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("smartcontracts")
        .setDescription("All smartcontracts of DopeWars!")
        .addStringOption((option: SlashCommandStringOption) =>
            option.setName("type")
            .setDescription("Type of contract to show")
            .setRequired(true)
            .addChoices(
                { name: "Gear (opt)" , value: "https://optimistic.etherscan.io/address/0x0E55e1913C50e015e0F60386ff56A4Bfb00D7110" },
                { name: "Hustler (opt)" , value: "https://optimistic.etherscan.io/address/0xDbfEaAe58B6dA8901a8a40ba0712bEB2EE18368E" },
                { name: "Dope (eth)" , value: "https://etherscan.io/address/0x8707276df042e89669d69a177d3da7dc78bd8723" }
            )),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply(interaction.options.getString("type") as InteractionResponseType);
    }
}
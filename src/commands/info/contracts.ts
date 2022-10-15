import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, InteractionResponseType } from "discord.js";
import { Constants } from "../../constants";

export default {
    data: new SlashCommandBuilder()
        .setName("smartcontracts")
        .setDescription("All smartcontracts of DopeWars!")
        .addStringOption((option: SlashCommandStringOption) =>
            option.setName("type")
            .setDescription("Type of contract to show")
            .setRequired(true)
            .addChoices(
                { name: "Gear (opt)" , value: `https://optimistic.etherscan.io/address/${Constants.GEAR_CONTRACT}` },
                { name: "Hustler (opt)" , value: `https://optimistic.etherscan.io/address/${Constants.HUSTLER_CONTRACT}` },
                { name: "Dope (eth)" , value: `https://etherscan.io/address/${Constants.DOPE_CONTRACT}` },
                { name: "Paper (eth)", value: `https://etherscan.io/address/${Constants.PAPER_ETH_CONTRACT}` },
                { name: "Paper (bsc)", value: `https://bscscan.com/address/${Constants.PAPER_BSC_CONTRACT}` },
                { name: "Paper (opti)", value: `https://optimistic.etherscan.io/address/${Constants.PAPER_OPTI_CONTRACT}` }
            )),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply(interaction.options.getString("type") as InteractionResponseType);
    }
}
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, InteractionReplyOptions, MessageEmbed } from "discord.js";
import { Constants } from "../../constants"

export default {
    data: new SlashCommandBuilder()
        .setName("wen")
        .setDescription("Tells you wen...")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("moon")
                .setDescription("Tells you wen moon"))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("game")
                .setDescription("Tells you wen game"))
    ,
    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        const fnMap: { [name: string]: Function }= {
            "moon": sendMoonEmbed,
            "game": sendGameEmbed
        }
        await fnMap[interaction.options.getSubcommand()](interaction);
    }
}

const sendGameEmbed = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    const wenGameEmbed = new MessageEmbed()
        .setTitle("Wen game ❓❓")
        .setColor("NOT_QUITE_BLACK")
        .setDescription("The game is actively in the design and development stage.\nSince it is a community led project with many moving parts,\nthere is no solid date for the game release.\nThe best way to track our progress is via our wiki page ([Roadmap](https://www.dopewars.gg/about)), DopeDao [updates](https://dope-wars.notion.site/0121b6435eb84e869231501295d729bd?v=f493d6b27ffd4816861308561197702a) and discord channels.")
        .setThumbnail(Constants.DW_THUMBNAIL);

    await interaction.reply({ embeds: [wenGameEmbed], ephmeral: false } as InteractionReplyOptions);


}

const sendMoonEmbed = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    const moonDate = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US');

    const moonEmbed = new MessageEmbed()
        .setColor("WHITE")
        .setTitle("Secret Moon Date 👀")
        .setDescription(`${moonDate} 🚀 🌑`);

    await interaction.reply({ embeds: [moonEmbed], ephmeral: false } as InteractionReplyOptions);
}

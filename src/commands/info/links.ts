import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Collection of helpful links')
        .addStringOption((option) =>
            option
                .setName('link')
                .setDescription('Link to send')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Tally',
                        value: 'https://www.tally.xyz/governance/eip155:1:0xDBd38F7e739709fe5bFaE6cc8eF67C3820830E0C'
                    },
                    {
                        name: 'SnapShot',
                        value: 'https://snapshot.org/#/dopedao.eth'
                    },
                    {
                        name: 'Treasury-Info',
                        value: 'https://dope-wars.notion.site/Treasury-Info-9e36498c9c7f46e9a2aca1e52c0a0863'
                    },
                    {
                        name: 'Treasury-Contract',
                        value: 'https://etherscan.io/address/0xb57ab8767cae33be61ff15167134861865f7d22c'
                    },
                    {
                        name: 'Wiki',
                        value: 'https://dope-wars.notion.site/dope-wars/Dope-Wiki-e237166bd7e6457babc964d1724befb2'
                    },
                    {
                        name: 'Discord',
                        value: 'https://discord.com/invite/BhVrn4sWG2'
                    },
                    {
                        name: 'Twitter',
                        value: 'https://twitter.com/TheDopeWars'
                    },
                    { name: 'Telegram', value: 'https://t.me/DopeWarsPaper' },
                    {
                        name: 'SwapMeet',
                        value: 'https://dopewars.gg/swap-meet'
                    },
                    {
                        name: 'Quixotic-Hustlers',
                        value: 'https://quixotic.io/collection/hustlers'
                    },
                    {
                        name: 'Quixotic-Gear',
                        value: 'https://quixotic.io/collection/gear'
                    },
                    {
                        name: 'OpenSea-Dope',
                        value: 'https://opensea.io/collection/dope-v4'
                    }
                )
        ),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply(interaction.options.getString('link')!);
    }
};

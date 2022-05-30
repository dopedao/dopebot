import { getSells } from './util/openseaSells';
import fs from 'node:fs';
import { Client, Collection, GuildMemberRoleManager, Intents, Interaction, VoiceChannel } from 'discord.js';
import { getTwitterFollowers } from './util/twitterFollowers';
import { getOsFloor } from './util/osFloor';
import { createLogger, transports, format } from 'winston';
import { secrets } from '../secrets';
const { combine, timestamp, label, json } = format;

interface CommandCollectionClient extends Client {
        commands?: Collection<any, any>
}

const client: CommandCollectionClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const logger = createLogger({
        level: "info",
        format: combine(
                timestamp(),
                label({ label: "client"}),
                json()
                ),
        transports: [ new transports.Console() ]
})

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
        for (const file of fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`./commands/${folder}/${file}`);
                client.commands.set(command.default.data.name, command.default)
        }
}

client.on('interactionCreate', async (interaction: Interaction): Promise<void> => {
        if (!interaction.isCommand()
        || (interaction.member!.roles as GuildMemberRoleManager).cache.find((role: any) => role.name === "packing heat")!.position > (interaction.member!.roles as GuildMemberRoleManager).highest.position) {
                return;
        }

        const command = client.commands!.get(interaction.commandName);
        if (!command) return;

        try {
                logger.info(`${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.user.id}) executed ${interaction.commandName}`)
                await command.execute(interaction);
        } catch(error: unknown) {
                if (error instanceof Error) {
                        logger.error(error);
                        await interaction.reply("There was an error executing the command");
                }
        }
});

client.once('ready', async (): Promise<void> => {
        logger.info(`${client!.user!.username}@${client!.user!.discriminator} is online`);
        client!.user!.setStatus("idle");
        await getSells(client);

        setInterval(async () => {
                try {
                        const osFloor = await getOsFloor();
                        const twitterFollowers = await getTwitterFollowers();

                        client!.user!.setActivity(`Floor: ${osFloor} ETH`, { type: "WATCHING" });
                        client.channels.cache.filter(channel => (channel as VoiceChannel).name.includes("Discord:")).map(channel => (channel as VoiceChannel).setName(`Discord: ${(channel as VoiceChannel).guild.memberCount}`));
                        client.channels.cache.filter(channel => (channel as VoiceChannel).name.includes("Twitter:")).map(channel => (channel as VoiceChannel).setName(`Twitter: ${twitterFollowers}`));
                } catch(error: unknown) {
                        logger.error(error);
                }
        }, 10000);
});

client.login(secrets.token);

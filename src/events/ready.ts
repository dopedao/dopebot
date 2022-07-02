import { Client, MessageActionRow, MessageButton, MessageEmbed, TextChannel, VoiceChannel } from "discord.js";
import { Constants } from "../constants";
import { startRedisSub } from "../redis/sub";
import { logger } from "../util/logger";
import { getSells } from "../util/openseaSells";
import { getOsFloor } from "../util/osFloor";
import { getTwitterFollowers } from "../util/twitterFollowers";

const log = logger("client");

export default {
    name: "ready",
    once: true,
    async execute(client: Client) {
        log.info(`${client!.user!.username}@${client!.user!.discriminator} is online`);
        client!.user!.setStatus("idle");
        const verifyChannel = client.channels.cache.get(Constants.VERIFY_CHANNEL_ID) as TextChannel;
        const messages = await verifyChannel.messages.fetch({limit: 10});
        messages.forEach(async message => {
                if (message.author.id == process.env.DBOT_CLIENT_ID) {
                        await message.delete();
                }
        });
        verifyChannel.send({ embeds: [verificationEmbed], components: [linkButton] });

        await getSells(client);
        await startRedisSub(client);


        setInterval(async () => {
                try {
                        const osFloor = await getOsFloor();
                        const twitterFollowers = await getTwitterFollowers();

                        client!.user!.setActivity(`Floor: ${osFloor} ETH`, { type: "WATCHING" });
                        client.channels.cache.filter(channel => (channel as VoiceChannel).name.includes("Discord:")).map(channel => (channel as VoiceChannel).setName(`Discord: ${(channel as VoiceChannel).guild.memberCount}`));
                        client.channels.cache.filter(channel => (channel as VoiceChannel).name.includes("Twitter:")).map(channel => (channel as VoiceChannel).setName(`Twitter: ${twitterFollowers}`));
                } catch(error: unknown) {
                        if (error instanceof Error) {
                                log.error(error.stack);
                        } else {
                                log.error(error);
                        }
                }
        }, 10000);
    }
}

const verificationEmbed = new MessageEmbed()
    .setTitle("DopeWars Verify")
    .setDescription("To get sick **Holder** roles click the link below and follow the instructions on our website")
    .setThumbnail(Constants.HUSTLER_GIF);

const linkButton = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setStyle("LINK")
            .setLabel("Get started")
            .setURL(process.env.DBOT_REDIRECT_URI!)
    );

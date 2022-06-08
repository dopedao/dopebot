import { Client, VoiceChannel } from "discord.js";
import { logger } from "../util/logger";
import { getSells } from "../util/openseaSells";
import { getOsFloor } from "../util/osFloor";
import { getTwitterFollowers } from "../util/twitterFollowers";

const log = logger("client");

export default {
    name: "ready",
    once: true,
    async execute(client: Client) {
        log.info(`${client.user!.username}@${client.user!.discriminator} is online`);
        client.user!.setStatus("idle");
        await getSells(client);

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
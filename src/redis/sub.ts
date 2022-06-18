import { Client } from "discord.js";
import { createClient } from "redis";
import { logger } from "../util/logger";

const log = logger("redis");

interface IDiscordUser {
    username: string,
    discriminator: string,
    id: string,
    // Email?
    email: string,
    paperCount: number,
    dopeCount: number,
    hustlerCount: number,
    isOg: boolean
}

const getPaperRole = (paperCount: number): (string | null) => {
    switch(true) {
        case paperCount >= 5000000:
            return "Drug Lord";
        case paperCount < 5000000 && paperCount >= 2000000:
            return "Kingpin";
        case paperCount < 2000000 && paperCount >= 1000000:
            return "Fixer";
        case paperCount < 1000000 && paperCount >= 750000:
            return "Lieutenant";
        case paperCount < 750000 && paperCount >= 500000:
            return "Hitman";
        case paperCount < 500000 && paperCount >= 350000:
            return "Enforcer";
        case paperCount < 350000 && paperCount >= 200000:
            return "Supplier";
        case paperCount < 200000 && paperCount >= 100000:
            return "Dealer";
        case paperCount < 100000 && paperCount >= 50000:
            return "Hopper";
        case paperCount < 50000 && paperCount >= 12500:
            return "Prospect"
        default:
            return null;
    }
}

export const startRedisSub = async (discClient: Client): Promise<void> => {
    throw new Error("\n\n\n\n\n\n\n\n\n\nYou are running the wrong bot mane...");

    try {
        const client = createClient();
        await client.connect();

        const subscriber = client.duplicate();
        await subscriber.connect();

        client.on('error', (err) => log.error(err));

        await subscriber.subscribe("discord", async (message) => {
            const discUser = JSON.parse(message) as IDiscordUser;
            const discUserName = `${discUser.username}#${discUser.discriminator}`;

            log.info(`${discUser.id} - ${discUser.username}#${discUser.discriminator} - ${discUser.paperCount} - ${discUser.dopeCount} - ${discUser.hustlerCount} - ${discUser.isOg}`);

            const guild = discClient.guilds.resolve(process.env.DBOT_GUILD_ID!);
            const members = await guild!.members.fetch({ force: true });
            const user = members.get(discUser.id);

            if (!user) {
                log.error(`User: ${discUserName} not in guild`);
                return;
            }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            log.error(error.message);
        } else {
            log.error(error)
        }
    }
}

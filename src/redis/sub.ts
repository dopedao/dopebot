import { Client } from "discord.js";
import { createClient } from "redis";
import { logger } from "../util/logger";

const log = logger("redis");

interface IDopeBotData {
    Id: string,
    WalletAddress: string,
    PaperCount: number,
    DopeCount: number,
    HustlerCount: number,
    IsOg: boolean,
}

const ogRole = 2623462346;
const dopeHolderRole = 124353253;
const hustlerHolderRole = 124353253;

enum DopeRoles {
    "Drug_Lord" = 234215,
    "Kingpin",
    "Fixer",
    "Lieutenant",
    "Hitman",
    "Robber",
    "Supplier",
    "Dealer",
    "Hopper",
    "Prospect"
}


const getPaperRole = (paperCount: number): (DopeRoles| null) => {
    switch (true) {
        case paperCount >= 5000000:
            return DopeRoles.Drug_Lord;
        case paperCount < 5000000 && paperCount >= 2000000:
            return DopeRoles.Kingpin;
        case paperCount < 2000000 && paperCount >= 1000000:
            return DopeRoles.Fixer;
        case paperCount < 1000000 && paperCount >= 750000:
            return DopeRoles.Lieutenant;
        case paperCount < 750000 && paperCount >= 500000:
            return DopeRoles.Hitman;
        case paperCount < 500000 && paperCount >= 350000:
            return DopeRoles.Robber;
        case paperCount < 350000 && paperCount >= 200000:
            return DopeRoles.Supplier;
        case paperCount < 200000 && paperCount >= 100000:
            return DopeRoles.Dealer;
        case paperCount < 100000 && paperCount >= 50000:
            return DopeRoles.Hopper;
        case paperCount < 50000 && paperCount >= 12500:
            return DopeRoles.Prospect;

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
    //throw new Error("\n\n\n\n\n\n\n\n\n\nYou are running the wrong bot mane...");

    try {
        const client = createClient();

        client.on('error', (err) => log.error(err));

        await client.subscribe("discord", async (message) => {
            const verifData = JSON.parse(message) as IDopeBotData;

            log.info(`Verifying ${verifData.Id} - ${verifData.DopeCount} - ${verifData.HustlerCount} - ${verifData.PaperCount} - ${verifData.IsOg}`);

            const guild = discClient.guilds.cache.get(process.env.DBOT_GUILD_ID!);
            log.info("Got guild.")
            const guildMember = guild?.members.cache.get(verifData.Id);
            log.info("Found member.")

            const role = getPaperRole(verifData.PaperCount);
            guildMember?.roles.add(String(role));
            log.info("Adding paper role")

            if (verifData.IsOg) {
                guildMember?.roles.add(String(ogRole));
            log.info("Adding og role")
            }

            if (verifData.DopeCount > 0) {
                guildMember?.roles.add(String(dopeHolderRole));
            log.info("Adding dope role")
            }

            if (verifData.HustlerCount> 0) {
                guildMember?.roles.add(String(hustlerHolderRole));
            log.info("Adding hustler role")
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

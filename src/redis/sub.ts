import { Client, GuildMember, GuildMemberRoleManager } from "discord.js";
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

const PaperRoles = {
    "Drug_Lord": "992788001325330472",
    "Kingpin": "992788125468344340",
    "Fixer": "992788183324577832",
    "Lieutenant": "992788307350126592",
    "Hitman": "992788307350126592",
    "Robber": "992788360018010152",
    "Supplier": "992788401742958632",
    "Dealer": "992788467824197742",
    "Hopper": "992788528209600543",
    "Prospect": "992788595846938706"
}

const ogRole = "992790020362612778";
const dopeHolderRole = "992790142651736134";
const hustlerHolderRole = "992790270712234154";

const getPaperRole = (paperCount: number): (string | null) => {
    switch (true) {
        case paperCount >= 5000000:
            return PaperRoles.Drug_Lord;
        case paperCount < 5000000 && paperCount >= 2000000:
            return PaperRoles.Kingpin;
        case paperCount < 2000000 && paperCount >= 1000000:
            return PaperRoles.Fixer;
        case paperCount < 1000000 && paperCount >= 750000:
            return PaperRoles.Lieutenant;
        case paperCount < 750000 && paperCount >= 500000:
            return PaperRoles.Hitman;
        case paperCount < 500000 && paperCount >= 350000:
            return PaperRoles.Robber;
        case paperCount < 350000 && paperCount >= 200000:
            return PaperRoles.Supplier;
        case paperCount < 200000 && paperCount >= 100000:
            return PaperRoles.Dealer;
        case paperCount < 100000 && paperCount >= 50000:
            return PaperRoles.Hopper;
        case paperCount < 50000 && paperCount >= 12500:
            return PaperRoles.Prospect;
        default:
            return null
    }
}

export const startRedisSub = async (discClient: Client): Promise<void> => {
    //throw new Error("\n\n\n\n\n\n\n\n\n\nYou are running the wrong bot mane...");

    try {
        const client = createClient();
        client.on('error', (err) => log.error(err));

        const sub = client.duplicate();
        sub.connect();

        await sub.subscribe("discord", async (message) => {
            log.info(message)
            const verifData = JSON.parse(message) as IDopeBotData;

            log.info(`Verifying ${verifData.Id} - ${verifData.DopeCount} - ${verifData.HustlerCount} - ${verifData.PaperCount} - ${verifData.IsOg}`);

            const guild = discClient.guilds.cache.get(process.env.DBOT_GUILD_ID!);
            if (!guild) {
                log.error("Could not get guild.");
                return;
            }

            const guildMember = (await guild.members.fetch()).get(verifData.Id);
            if (guildMember == undefined) {
                log.error(`Could not find member.`);
                return;
            }

            const guildRoles = guildMember.guild.roles.cache;
            if (!guildRoles) {
                log.error("Could not fetch guild roles");
                return;
            }

            const paperRole = getPaperRole(verifData.PaperCount);
            const setPaperRoles = getPaperRolesOf(guildMember);
            if (paperRole) {
                const highestRole = guildRoles.get(paperRole)?.position!;

                Object.values(PaperRoles).forEach(async role => {
                    if (guildRoles.get(role)?.position! <= highestRole) {
                        await guildMember.roles.add(role);
                    }
                });
            } else {
                setPaperRoles.forEach(async role => {
                        await guildMember.roles.remove(role);
                });
            }


            await addOrRmRole(guildMember, ogRole, verifData.IsOg, "Og");
            await addOrRmRole(guildMember, dopeHolderRole, verifData.DopeCount > 0, "Dope");
            await addOrRmRole(guildMember, hustlerHolderRole, verifData.HustlerCount > 0, "hustler");
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            log.error(error.stack);
        } else {
            log.error(error)
        }
    }
}

const hasRole = (role: string, roles: GuildMemberRoleManager): boolean => {
    return roles.cache.has(role);
}

const getPaperRolesOf = (member: GuildMember): string[] => {
    const setRoles: string[] = [];

    member.roles.cache.forEach(role => {
        if (Object.values(PaperRoles).some(x => x === role.id)) {
            setRoles.push(role.id)
        }
    });

    return setRoles;
}
const addOrRmRole = async (member: GuildMember, role: string, condition: boolean, roleName: string): Promise<void> => {
    const memberRoles = member.roles;
    const hasReqRole = hasRole(role, memberRoles);

    if (!condition && !hasReqRole
        || condition && hasReqRole) {
        return;
    }
    
    if (condition && !hasReqRole) {
        await memberRoles.add(role);
        return;
    }

    await memberRoles.remove(role);
}


import { GuildMember } from 'discord.js';
import { logger } from '../util/logger';

const log = logger('GuildJoin');

export default {
    name: 'guildMemberAdd',
    once: false,
    async execute(member: GuildMember): Promise<void> {
        log.info(`${member.id} - ${member.displayName} joined the disc!`);
    }
};

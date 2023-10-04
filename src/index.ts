import fs from 'node:fs';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import path from 'path/posix';
import { ICommandCollectionClient } from './interfaces/ICommandCollectionClient';
import { logger } from './util/logger.js';
import { ethers } from 'ethers';
import { Constants } from './constants';
import PaperAbi from './abis/Paper.json';
import InitiatorAbi from './abis/Initiator.json';
import { BigNumberish } from '@ethersproject/bignumber';

const log = logger('Startup');

const client: ICommandCollectionClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();

log.debug('Loading commands');
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    for (const file of fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith('.js'))) {
        import(`./commands/${folder}/${file}`).then((x) =>
            client.commands!.set(x.default.data.name, x.default)
        );
    }
}
log.debug('Finished loading commands');

log.debug('Loading events');
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    import(filePath).then((x) => {
        const { default: event } = x;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    });
}
log.debug('Finished loading events');

process.on('unhandledRejection', (error) => {
    log.error(error);
});

(async () => client.login(process.env.DBOT_CLIENT_TOKEN))().catch((err) => {
    if (err instanceof Error) {
        log.error(err.stack);
    } else {
        log.error(err);
    }
});

const provider = new ethers.JsonRpcProvider(Constants.DBOT_ALCHEMY_API_URL);
const PaperContract = new ethers.Contract(
    Constants.PAPER_ETH_CONTRACT,
    PaperAbi,
    provider
);
const InitiatorContract = new ethers.Contract(
    Constants.INITIATOR_ETH_CONTRACT,
    InitiatorAbi,
    provider
);

const HasClaimedPaper = async (tokenId: BigNumberish) => {
    return await PaperContract.claimedByTokenId(tokenId);
};

const HasClaimedGear = async (tokenId: BigNumberish) => {
    return await InitiatorContract.isOpened(tokenId);
};

export { HasClaimedPaper, HasClaimedGear };

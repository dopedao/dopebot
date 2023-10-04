import { Client, VoiceChannel } from 'discord.js';
import { logger } from '../util/logger';
import { Network, OpenSeaStreamClient } from '@opensea/stream-js';
import { Constants } from '../constants';
import WebSocket from 'ws';
import handleSale from '../handlers/sale';
import handleListing from '../handlers/listing';

const log = logger('client');

export default {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        log.info(
            `${client!.user!.username}@${client!.user!.discriminator} is online`
        );
        client!.user!.setStatus('idle');

        const osStreamClient = createOsStreamClient();

        osStreamClient.onItemSold(Constants.DOPE_OS_SLUG, (e) =>
            handleSale(e, client)
        );
        osStreamClient.onItemListed(Constants.DOPE_OS_SLUG, (e) =>
            handleListing(e, client)
        );

        setInterval(async () => {
            try {
                client.channels.cache
                    .filter((channel) =>
                        (channel as VoiceChannel).name.includes('Discord:')
                    )
                    .map((channel) =>
                        (channel as VoiceChannel).setName(
                            `Discord: ${
                                (channel as VoiceChannel).guild.memberCount
                            }`
                        )
                    );
            } catch (error: unknown) {
                if (error instanceof Error) {
                    log.error(error.stack);
                } else {
                    log.error(error);
                }
            }
        }, 10000);
    }
};

const createOsStreamClient = () =>
    new OpenSeaStreamClient({
        token: String(process.env.DBOT_OS_API_KEY),
        network: Network.MAINNET,
        connectOptions: {
            transport: WebSocket
        },
        onError: (err) => log.error(err)
    });

import { ItemSoldEvent } from '@opensea/stream-js';
import { Client, TextChannel } from 'discord.js';
import { Constants } from '../constants';
import { embedBuilder, getPrices, isVeryOldSale } from './utils';

const handleSale = async (sale: ItemSoldEvent, client: Client) => {
    if (isVeryOldSale(sale.sent_at, sale.payload.event_timestamp)) return;

    const nftId = Number(sale.payload.item.nft_id.split('/')[2]);

    const { ethValue, nftPriceInUsd } = getPrices(
        sale.payload.payment_token.usd_price,
        sale.payload.payment_token.eth_price,
        sale.payload.sale_price
    );

    const embed = await embedBuilder(
        nftId,
        ethValue.toString(),
        nftPriceInUsd.toFixed(2),
        String(sale.payload.item.metadata.name)
    );

    await (
        client.channels.cache.get(Constants.TEST_CHANNEL_ID) as TextChannel
    ).send({ embeds: [embed.openseaSellEmbed], files: [embed.dopePNG] });
};

export default handleSale;

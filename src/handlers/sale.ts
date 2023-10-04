import { ItemSoldEvent } from '@opensea/stream-js';
import { Client, TextChannel } from 'discord.js';
import { Constants } from '../constants';
import { EmbedType, embedBuilder, getPrices, isVeryOldSale } from './utils';

const handleSale = async (sale: ItemSoldEvent, client: Client) => {
    if (isVeryOldSale(sale.sent_at, sale.payload.event_timestamp)) return;

    const nftId = Number(sale.payload.item.nft_id.split('/')[2]);
    const { ethPrice, nftUsdPrice } = getPrices(
        Number(sale.payload.payment_token.usd_price),
        Number(sale.payload.payment_token.eth_price),
        sale.payload.sale_price
    );

    const embed = await embedBuilder(
        nftId,
        ethPrice.toFixed(3),
        nftUsdPrice.toFixed(2),
        String(sale.payload.item.metadata.image_url),
        EmbedType.SALE,
        sale.payload.maker.address,
        sale.payload.taker.address
    );

    await (
        client.channels.cache.get(Constants.TEST_CHANNEL_ID) as TextChannel
    ).send({ embeds: [embed.openseaSellEmbed], files: [embed.dopePNG] });
};

export default handleSale;

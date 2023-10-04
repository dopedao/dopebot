import { ItemListedEvent } from '@opensea/stream-js';
import { Client, TextChannel } from 'discord.js';
import { EmbedType, embedBuilder, getPrices, isVeryOldSale } from './utils';
import { Constants } from '../constants';

const handleListing = async (listing: ItemListedEvent, client: Client) => {
    if (isVeryOldSale(listing.sent_at, listing.payload.event_timestamp)) return;

    const nftId = Number(listing.payload.item.nft_id.split('/')[2]);
    const { ethPrice, nftUsdPrice } = getPrices(
        Number(listing.payload.payment_token.usd_price),
        Number(listing.payload.payment_token.eth_price),
        listing.payload.base_price
    );

    const embed = await embedBuilder(
        nftId,
        ethPrice.toFixed(3),
        nftUsdPrice.toFixed(2),
        String(listing.payload.item.metadata.metadata_url),
        EmbedType.LISTING,
        listing.payload.maker.address
    );

    await (
        client.channels.cache.get(Constants.TEST_CHANNEL_ID) as TextChannel
    ).send({ embeds: [embed.openseaSellEmbed], files: [embed.dopePNG] });
};

export default handleListing;

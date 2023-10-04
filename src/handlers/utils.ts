import { Constants } from '../constants';
import { AttachmentBuilder, Colors, EmbedBuilder } from 'discord.js';
import getParsedDope from '../util/getParsedDope';
import { ethers } from 'ethers';

const isVeryOldSale = (sentAt: string, eventTimestamp: string): boolean => {
    const sentAtDate = new Date(sentAt);
    const eventTimestampDate = new Date(eventTimestamp);

    const sentAtUnix = Math.floor(sentAtDate.getTime() / 1000);
    const eventTimestampUnix = Math.floor(eventTimestampDate.getTime() / 1000);

    return sentAtUnix - eventTimestampUnix > 60 * 60;
};

const getPrices = (
    paymentTokenUSD: number,
    paymentTokenETH: number,
    salePriceInWei: string
) => {
    const ethPrice = Number(ethers.formatUnits(salePriceInWei, 'ether'));
    const paymentTokenUsdValue = paymentTokenUSD / paymentTokenETH;
    const nftUsdPrice = ethPrice * paymentTokenUsdValue;

    return {
        ethPrice,
        nftUsdPrice
    };
};

enum EmbedType {
    SALE,
    LISTING
}

const embedBuilder = async (
    nftId: number,
    ethValue: string,
    nftPriceInUsd: string,
    metadata: string,
    embedType: EmbedType,
    makerAddr: string,
    takerAddr: string | undefined = undefined
) => {
    const { dopeSVG, dopeRank, opened, claimed } = await getParsedDope(
        nftId,
        metadata
    );

    const openseaSellEmbed = new EmbedBuilder()
        .setImage('attachment://dope.png')
        .setTitle(
            `🎉 Dope #${nftId} ${
                embedType === EmbedType.SALE ? 'Sold' : 'Listed'
            }!`
        )
        .setDescription(`**Rank:** ${dopeRank}`)
        .setColor(embedType === EmbedType.SALE ? Colors.Green : Colors.Blue)
        .setURL(`${Constants.OS_DOPE_LINK}/${nftId}`)
        .setFields(
            {
                name: `💰 ${ethValue.toString()}Ξ (~${nftPriceInUsd}$)`,
                value: '\u200b'
            },
            {
                name: `🎒 Gear claimable ${opened}`,
                value: '\u200b'
            },
            {
                name: `💸 Paper claimable ${claimed}`,
                value: '\u200b'
            },
            {
                name: `👤 Seller`,
                value: `[${makerAddr.slice(0, 6)}...${makerAddr.slice(
                    -4
                )}](https://etherscan.io/address/${makerAddr})`,
                inline: true
            }
        );

    if (embedType == EmbedType.SALE) {
        openseaSellEmbed.addFields({
            name: `👥 Buyer`,
            value: `[${takerAddr!.slice(0, 6)}...${takerAddr!.slice(
                -4
            )}](https://etherscan.io/address/${takerAddr})`,
            inline: true
        });
    }

    const dopePNG = new AttachmentBuilder(dopeSVG, {
        name: 'dope.png'
    });

    return { openseaSellEmbed, dopePNG };
};

export { isVeryOldSale, getPrices, embedBuilder, EmbedType };

import { BigNumber } from '@ethersproject/bignumber';
import { logger } from '../util/logger';
import { Constants } from '../constants';
import { AttachmentBuilder, Colors, EmbedBuilder } from 'discord.js';
import getParsedDope from '../util/getParsedDope';
import { ethers } from 'ethers';

const log = logger('getPrices');

const isVeryOldSale = (sentAt: string, eventTimestamp: string): boolean => {
    // Parse the date strings into Date objects
    const sentAtDate = new Date(sentAt);
    const eventTimestampDate = new Date(eventTimestamp);

    // Get the timestamps in seconds
    const sentAtUnix = Math.floor(sentAtDate.getTime() / 1000);
    const eventTimestampUnix = Math.floor(eventTimestampDate.getTime() / 1000);

    // Check the difference and compare with 1 hour (60 * 60 seconds)
    return sentAtUnix - eventTimestampUnix > 60 * 60;
};

const loggs = (
    paymentTokenUSD: number,
    paymentTokenETH: number,
    salePriceInWei: string
) => {
    const ethPrice = ethers.formatUnits(salePriceInWei, 'ether');
    const paymentTokenUsdValue = paymentTokenUSD / paymentTokenETH;
    const nftUsdPrice = BigNumber.from(ethPrice).mul(paymentTokenUsdValue);

    log.info(
        `logs:: ethPrice: ${ethPrice.toString()}, paymentTokenUsdValue: ${paymentTokenUsdValue.toString()}, nftUsdPrice:: ${nftUsdPrice.toString()}`
    );
    return {
        ethPrice,
        nftUsdPrice
    };
};

const getPrices = (usdPrice: string, ethPrice: string, salePricee: string) => {
    loggs(Number(usdPrice), Number(ethPrice), salePricee);
    log.info(
        `usdPrice: ${usdPrice}, ethPrice: ${ethPrice}, salePrice: ${salePricee}`
    );

    const tokenUsdPrice = BigNumber.from(usdPrice);
    const salePrice = BigNumber.from(ethPrice);
    const ethValue = salePrice.div(BigNumber.from(Constants.dwApiEthConvValue));
    const nftPriceInUsd = tokenUsdPrice.mul(ethValue).toNumber();

    return { ethValue, nftPriceInUsd };
};

const embedBuilder = async (
    nftId: number,
    ethValue: string,
    nftPriceInUsd: string,
    name: string
) => {
    const { dopeSVG, dopeRank, opened, claimed } = await getParsedDope(
        nftId,
        name
    );

    const openseaSellEmbed = new EmbedBuilder()
        .setImage('attachment://dope.png')
        .setTitle(`⛵ Dope #${nftId} (Rank: ${dopeRank}) sold!`)
        .setColor(Colors.Orange)
        .setURL(`${Constants.OS_DOPE_LINK}/${nftId}`)
        .setFields(
            {
                name: `🔹 ${ethValue.toString()}Ξ (${nftPriceInUsd}$)`,
                value: '\u200b'
            },
            {
                name: `🔹 Claimed Gear ${opened}`,
                value: '\u200b'
            },
            {
                name: `🔹 Claimed Paper ${claimed}`,
                value: '\u200b'
            }
        );

    const dopePNG = new AttachmentBuilder(dopeSVG, {
        name: 'dope.png'
    });

    return { openseaSellEmbed, dopePNG };
};

export { isVeryOldSale, getPrices, embedBuilder };

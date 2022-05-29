import { Constants } from "../constants";
import { sfetch } from "./sfetch";
import { secrets } from "../../secrets";
import moment from "moment";
import { MessageEmbed, MessageAttachment, Client, TextChannel } from "discord.js";
import { svgRenderer } from "./svgRenderer";
import request from "graphql-request";
import { dopeQueries } from "../Queries/dopeQueries";
import { createLogger, transports, format } from "winston";
const { combine, timestamp, label, json } = format;

const logger = createLogger({
    level: "info",
    format: combine(
        timestamp(),
        label({ label: "OpenSea Sells" }),
        json()
    ),
    transports: [new transports.Console()]
});

const getSells = async (client: Client): Promise<void> => {
    let lastSellDate = moment.utc(moment()).unix();
    const cache: any = [];

    setInterval(async () => {
        try {
            const data = await sfetch(`${Constants.OS_API}/events?` + new URLSearchParams({
                only_opensea: "false",
                asset_contract_address: Constants.DOPE_CONTRACT,
                event_type: "successful",
                occurred_after: lastSellDate
            } as any), {
                method: 'GET',
                headers: {
                    'X-API-KEY': secrets.openseaApiKey,
                }
            });

            if (data.asset_events) {
                data.asset_events.forEach(async (sell: any) => {
                    const sellObj = {
                        id: sell.asset.token_id,
                        timestamp: sell.transaction.timestamp,
                        price: sell.total_price
                    }

                    if (moment(sellObj.timestamp).unix() < lastSellDate || cache.some((newSell: any) => newSell.id == sellObj.id && newSell.timestamp == sellObj.timestamp && newSell.price == sellObj.price)) {
                        return;
                    }

                    lastSellDate = moment(sellObj.timestamp).unix();
                    logger.info(`LastSell: ${sellObj.timestamp}`);
                    cache.push(sellObj);
                    logger.info(`OpenSea sell cache size: ${cache.length}`)

                    const dope = await request(Constants.DW_GRAPHQL_API, dopeQueries.dopeSellQuery, { "where": { "id": sellObj.id } });
                    const dopeRoot = dope.dopes.edges[0].node;
                    const claimed = dopeRoot.claimed ? '✅' : '❌';
                    const opened = dopeRoot.opened ? '✅' : '❌';
                    const dopeRank = dopeRoot.rank;
                    const metadataString = sell.asset.token_metadata.split(',')[1];
                    const decodedMetadataString = Buffer.from(metadataString, "base64").toString("utf-8");
                    const metadataObject = JSON.parse(decodedMetadataString);
                    const base64ImageString = metadataObject.image.split(',')[1];
                    const dopeSVG = await svgRenderer(base64ImageString);

                    const usdSellPrice = sell.payment_token.usd_price * (sell.total_price / Constants.dwApiEthConvValue);

                    const dopePNG = new MessageAttachment(dopeSVG, "dope.png");
                    const openseaSellEmbed = new MessageEmbed()
                        .setImage("attachment://dope.png")
                        .setTitle(`⛵ Dope #${sellObj.id} (Rank: ${dopeRank}) sold!`)
                        .setURL(`https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${sellObj.id}`)
                        .setFields(
                            { name: `🔹 ${(sell.total_price / Constants.dwApiEthConvValue).toFixed(4)}Ξ (${usdSellPrice.toFixed(2)}$)`, value: "\u200b" },
                            { name: `🔹 Claimed Gear ${opened}`, value: "\u200b" },
                            { name: `🔹 Claimed Paper ${claimed}`, value: "\u200b" }
                        );

                    await (client.channels.cache.get(Constants.SALE_CHANNEL)! as TextChannel).send({ embeds: [openseaSellEmbed], files: [dopePNG] });
                });
            }

            if (cache.length > 0) {
                for (let i = cache.length - 1; i >= 0; i--) {
                    if (moment(cache[i].timestamp).unix() < lastSellDate) {
                        logger.info(`Old sell found ${cache[i].id}: deleting...`);
                        cache.splice(i, 1);
                    }
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(error);
            }
        }
    }, 10000);
}

module.exports = getSells;
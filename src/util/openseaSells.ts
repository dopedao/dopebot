import { Constants } from "../constants";
import { sfetch } from "./sfetch";
import moment from "moment";
import { MessageEmbed, MessageAttachment, Client, TextChannel } from "discord.js";
import { svgRenderer } from "./svgRenderer";
import request from "graphql-request";
import { dopeQueries } from "../Queries/dopeQueries";
import { IAsset_Event, IOpenSeaSells } from "../interfaces/IOpenSeaSell";
import { IDope } from "../interfaces/IDope";
import { logger } from "./logger";

const log = logger("OpenSea Sells");

type OpenSeaSale = {
    id: number;
    timestamp: string;
    price: number;
}

export const getSells = async (client: Client): Promise<void> => {
    let lastSellDate: number = moment.utc(moment()).unix();
    const cache: OpenSeaSale[] = [];

    setInterval(async () => {
        try {
            const data = await sfetch<IOpenSeaSells>(`${Constants.OS_API}/events?` + new URLSearchParams({
                only_opensea: "false",
                asset_contract_address: Constants.DOPE_CONTRACT,
                event_type: "successful",
                occurred_after: lastSellDate
            } as {}), {
                method: 'GET',
                headers: {
                    'X-API-KEY': process.env.DBOT_OS_API_KEY,
                }
            });

            if (data?.asset_events) {
                data.asset_events.forEach(async (sell: IAsset_Event) => {
                    const newSale: OpenSeaSale  = {
                        id: sell.asset.token_id,
                        timestamp: sell.transaction.timestamp,
                        price: sell.total_price
                    }

                    if (moment(newSale.timestamp).unix() < lastSellDate
                    || cache.some((oldSale: OpenSeaSale) => oldSale.id == newSale.id
                    && oldSale.timestamp == newSale.timestamp
                    && oldSale.price == newSale.price)) {
                        return;
                    }

                    log.debug(`New sale: ${newSale.timestamp}`);
                    cache.push(newSale);

                    const dope = await request<IDope>(Constants.DW_GRAPHQL_API, dopeQueries.dopeSellQuery, { "where": { "id": newSale.id } });
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
                        .setTitle(`⛵ Dope #${newSale.id} (Rank: ${dopeRank}) sold!`)
                        .setURL(`https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${newSale.id}`)
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
                        log.debug(`Old sell found ${cache[i].id}: deleting...`);
                        cache.splice(i, 1);
                        log.debug(`New cache size: ${cache.length}`);
                    } else {
                        lastSellDate = moment(cache[i].timestamp).unix();
                        log.debug(`LastSellDate: ${lastSellDate}`)
                    }
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                log.error(error.stack);
            } else {
                log.error(error);
            }
        }
    }, 10000);
}

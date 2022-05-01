const { dwApiEthConvValue, ERROR_CHANNEL, DOPE_CONTRACT, OS_API, DW_GRAPHQL_API } = require("../constants")
const { sfetch } = require("./sfetch")
const { openseaApiKey } = require("../config.json");
const moment = require("moment");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { svgRenderer } = require("./svgRenderer");
const { createLogger, transports, format } = require('winston');
const { default: request } = require("graphql-request");
const { dopeStatusQuery } = require("../Queries/dopeQueries");
const { combine, timestamp, label, json } = format;

const logger = createLogger({
        level: "info",
        format: combine(
                timestamp(),
                label({ label: "OpenSea Sells"}),
                json()
                ),
        transports: [ new transports.Console() ]
})

const getSells = async (client) => {
    let lastSellDate = moment.utc(moment()).unix();
    const cache = [];

    setInterval(async () => {
        try {
            const data = await sfetch(`${OS_API}/events?`+ new URLSearchParams({
                only_opensea: "false",
                asset_contract_address: DOPE_CONTRACT,
                event_type: "successful",
                occurred_after: lastSellDate
            }), {
                method: 'GET',
                headers: {
                    'X-API-KEY': openseaApiKey,
                }
            });

            if (data.asset_events) {
                data.asset_events.forEach(async sell =>  {
                    const sellObj = {
                        id: sell.asset.token_id,
                        timestamp: sell.transaction.timestamp,
                        price: sell.total_price
                    }

                    if (cache.some(newSell => newSell.id == sellObj.id && newSell.timestamp == sellObj.timestamp && newSell.price == sellObj.price)) {
                        return;
                    }

                    cache.push(sellObj);
                    logger.info("Sell -> Cache");
                    logger.info(`OpenSea sell cache size: ${cache.length}`)
                    if (moment(sellObj.timestamp).unix() > lastSellDate) {
                        lastSellDate = moment(sellObj.timestamp).unix() + 1;
                    }
                    logger.info(`LastSell: ${sellObj.timestamp}`);

                    const dope = await request(DW_GRAPHQL_API, dopeStatusQuery, { "where": { "id": sellObj.id } });
                    const dopeRoot = dope.dopes.edges[0].node;
                    const claimed = dopeRoot.claimed ? '✅' : '❌';
                    const opened = dopeRoot.opened ? '✅' : '❌';
                    const metadataString = sell.asset.token_metadata.split(',')[1];
                    const decodedMetadataString = new Buffer.from(metadataString, "base64").toString("utf-8");
                    const metadataObject = JSON.parse(decodedMetadataString);
                    const base64ImageString = metadataObject.image.split(',')[1];
                    const dopeSVG = await svgRenderer(base64ImageString);

                    const usdSellPrice = sell.payment_token.usd_price * (sell.total_price / dwApiEthConvValue);

                    const dopePNG = new MessageAttachment(dopeSVG, "dope.png");
                    const openseaSellEmbed = new MessageEmbed()
                        .setTitle("⛵ New Sell")
                        .setDescription(`DopeId: ${sell.asset.token_id}\n${sell.transaction.timestamp}\n${(sell.total_price / dwApiEthConvValue).toFixed(4)} ETH (${usdSellPrice.toFixed(2)} $)\nGear Claimed: ${opened}\nPaper Claimed: ${claimed}`)
                        .setImage("attachment://dope.png");

                    await client.channels.cache.get(ERROR_CHANNEL).send({ embeds: [openseaSellEmbed], files: [dopePNG] });
                });

                cache.forEach(sell => {
                    if (moment(sell.timestamp).unix < lastSellDate) {
                        logger.info(`Old sell found ${sell.id}, ${sell.timestamp}, ${sell.price}: deleting...`);
                        delete cache[sell];
                    }
                })
            }
        } catch (error) {
            logger.error(`${error}`);
        }
    }, 10000);
}

module.exports = getSells;
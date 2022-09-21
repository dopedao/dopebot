import { Constants } from "../../constants";
import moment from "moment";
import {
  MessageEmbed,
  MessageAttachment,
  Client,
  TextChannel,
} from "discord.js";
import { AssetEvent, OpenSeaEvent } from "../../interfaces/OpenSeaEvent";
import { logger } from "../../util/logger";
import getDope from "../getDope";
import osEventFetcher from "../osEventFetcher";

const log = logger("OpenSea listing create");

type OpenSeaListingCreate = {
  id: number;
  timestamp: string;
  price: number;
};

export const getListingCreate = async (client: Client): Promise<void> => {
  let lastSellDate: number = moment.utc(moment()).unix();
  const cache: OpenSeaListingCreate[] = [];

  setInterval(async () => {
    try {
      const data = await osEventFetcher<OpenSeaEvent>("created", lastSellDate);

      if (data?.asset_events) {
        data.asset_events.forEach(async (sell: AssetEvent) => {
          const newSale: OpenSeaListingCreate = {
            id: sell.asset.token_id,
            timestamp: sell.created_date,
            price: sell.starting_price,
          };

          if (
            moment(newSale.timestamp).unix() < lastSellDate ||
            cache.some(
              (oldSale: OpenSeaListingCreate) =>
                oldSale.id == newSale.id &&
                oldSale.timestamp == newSale.timestamp &&
                oldSale.price == newSale.price
            )
          ) {
            return;
          }

          log.debug(`New listing: ${newSale.timestamp}`);
          cache.push(newSale);

          const { dopeSVG, dopeRank, opened, claimed } = await getDope(newSale.id, sell.asset.token_metadata);

          const usdSellPrice =
            sell.payment_token.usd_price *
            (sell.starting_price / Constants.dwApiEthConvValue);

          const dopePNG = new MessageAttachment(dopeSVG, "dope.png");
          const openseaSellEmbed = new MessageEmbed()
            .setImage("attachment://dope.png")
            .setTitle(`⛵ Dope #${newSale.id} (Rank: ${dopeRank}) listed!`)
            .setColor("GREEN")
            .setURL(
              `https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${newSale.id}`
            )
            .setFields(
              {
                name: `🔹 ${(
                  sell.starting_price / Constants.dwApiEthConvValue
                ).toFixed(4)}Ξ (${usdSellPrice.toFixed(2)}$)`,
                value: "\u200b",
              },
              { name: `🔹 Claimed Gear ${opened}`, value: "\u200b" },
              { name: `🔹 Claimed Paper ${claimed}`, value: "\u200b" }
            );

          await (
            client.channels.cache.get("1021577538486669381") as TextChannel
          ).send({ embeds: [openseaSellEmbed], files: [dopePNG] });
        });
      }

      if (cache.length > 0) {
        for (let i = cache.length - 1; i >= 0; i--) {
          if (moment(cache[i].timestamp).unix() < lastSellDate) {
            log.debug(`Old listing found ${cache[i].id}: deleting...`);
            cache.splice(i, 1);
            log.debug(`New cache size: ${cache.length}`);
          } else {
            lastSellDate = moment(cache[i].timestamp).unix();
            log.debug(`LastListingDate: ${lastSellDate}`);
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
};

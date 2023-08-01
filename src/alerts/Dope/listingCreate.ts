import { Constants } from "../../constants";
import moment from "moment";
import {
  MessageEmbed,
  MessageAttachment,
  Client,
  TextChannel,
} from "discord.js";
import { AssetEvent } from "../../interfaces/OpenSeaEvent";
import { logger } from "../../util/logger";
import osEventFetcher from "../osEventFetcher";
import getParsedDope from "./getParsedDope";
import { isMuted } from "../../commands/listings/listings";
import { constants } from "ethers";

const log = logger("OpenSea listing create");

export const getListingCreate = async (client: Client): Promise<void> => {
  let lastSellDate: number = moment.utc(moment()).unix();

  setInterval(async () => {
    try {
      const data = await osEventFetcher(
        "created",
        lastSellDate,
        Constants.DOPE_CONTRACT
      );

      if (data.asset_events) {
        const sortedEvents = data.asset_events.sort((x, y) => moment(x.created_date).unix() - moment(y.created_date).unix());

        sortedEvents.forEach(async (sell: AssetEvent) => {
          const newSale = {
            id: sell.asset.token_id,
            timestamp: sell.created_date,
            price: sell.starting_price,
          };

          const sellDateUnix = moment(newSale.timestamp).unix();
          if (sellDateUnix <= lastSellDate || isMuted(newSale.id)) {
            return;
          }
          lastSellDate = sellDateUnix;
          log.debug(`New listing: ${newSale.timestamp}`);

          const { dopeSVG, dopeRank, opened, claimed } = await getParsedDope(
            newSale.id,
            sell.asset.token_metadata
          );

          const usdSellPrice =
            sell.payment_token.usd_price *
            (sell.starting_price / Constants.dwApiEthConvValue);

          const dopePNG = new MessageAttachment(dopeSVG, "dope.png");
          const openseaSellEmbed = new MessageEmbed()
            .setImage("attachment://dope.png")
            .setTitle(`⛵ Dope #${newSale.id} (Rank: ${dopeRank}) listed!`)
            .setColor("GREEN")
            .setURL(
              `${Constants.OS_DOPE_LINK}/${newSale.id}`
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
            client.channels.cache.get(Constants.TEST_CHANNEL_ID) as TextChannel
          ).send({ embeds: [openseaSellEmbed], files: [dopePNG] });
        });
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

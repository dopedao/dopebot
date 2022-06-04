import { sfetch } from "./sfetch";
import { Constants } from "../constants";

export const getTwitterFollowers = async (): Promise<number> => {
    try {
        const response = await sfetch(Constants.TWITTER_METRICS_LINK, { headers: { authorization: process.env.DBOT_TWITTER_BEARER_TOKEN } });
        return response.data.public_metrics.followers_count;
    } catch(error: unknown) {
        return Promise.reject(error);
    }
}
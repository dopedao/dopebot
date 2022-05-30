import { sfetch } from "./sfetch";
import { Constants } from "../constants";
import { secrets } from "../../secrets";

export const getTwitterFollowers = async (): Promise<number> => {
    try {
        const response = await sfetch(Constants.TWITTER_METRICS_LINK, { headers: { authorization: secrets.twitterBearerToken } });
        return response.data.public_metrics.followers_count;
    } catch(error: unknown) {
        return Promise.reject(error);
    }
}
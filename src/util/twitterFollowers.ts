import { sfetch } from "./sfetch";
import { Constants } from "../constants";
import { secrets } from "../../secrets";


export const getTwitterFollowers = async (): Promise<number> => {
    const response = await sfetch(Constants.TWITTER_METRICS_LINK, { headers: { authorization: secrets.twitterBearerToken } })
    if (!response) {
        return Promise.reject(response.statusText);
    }

    return response.data.public_metrics.followers_count;
}
const { sfetch } = require("./sfetch");
const { TWITTER_METRICS_LINK } = require('../constants');
const { twitterBearerToken } = require("../config.json")

exports.getTwitterFollowers = async () => {
    const response = await sfetch(TWITTER_METRICS_LINK, { headers: { authorization: twitterBearerToken } })
    if (!response) {
        return Promise.reject(response.statusText);
    }

    return response.data.public_metrics.followers_count;
}
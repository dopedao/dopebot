const { sfetch } = require("./sfetch");
const { dWOpenSeaApiLink } = require("../constants");

exports.getOsFloor = async () => {
    const response = await sfetch(dWOpenSeaApiLink)
    if (!response) {
        return Promise.reject(response.statusText);
    }

    return response.stats.floor_price;
}
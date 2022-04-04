const { sfetch } = require("./sfetch");
const { dWOpenSeaApiLink } = require("../constants");

module.exports = {
    async getOsFloor() {
        const response = await sfetch(dWOpenSeaApiLink)
        if (!response) {
            return Promise.reject(response.statusText);
        }

        return response.stats.floor_price;
    }
}
const { sfetch } = require("./sfetch");
const { OS_API, OS_SLUG } = require("../constants");

exports.getOsFloor = async () => {
    const response = await sfetch(`${OS_API}/collection/${OS_SLUG}/stats`)
    if (!response?.stats?.floor_price) {
        return Promise.reject(response.statusText);
    }

    return response.stats.floor_price;
}

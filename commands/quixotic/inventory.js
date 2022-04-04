const { sfetch } = require("../../util/sfetch");
const { quixoticApi } = require("../../constants");
const { quixoticApiKey } = require("../../config.json");

module.exports = {
    name: "qx",
    description: "Quixotic commands",
    args: "(1-8000)",
    async execute(message) {
        const convValue = 1000000000;
        const collectionData = await sfetch(quixoticApi, { headers: { "X-API-KEY": quixoticApiKey } });
        if (!collectionData) {
            return Promise.reject();
        }

        await message.channel.send(`Floor: ${collectionData.floor_price / convValue}\nTrading Volume: ${(collectionData.volume_traded / convValue).toFixed(2)}`);
    }
};
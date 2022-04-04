const { sfetch } = require("../../util/sfetch");
const { quixoticDwApi } = require("../../constants");
const { quixoticApiKey } = require("../../config.json");

module.exports = {
    name: "qx",
    description: "Quixotic Test commands",
    args: "(1-8000)",
    async execute(message) {
        const convValue = 1000000000;
        const collectionData = await sfetch(quixoticDwApi, { headers: { "X-API-KEY": quixoticApiKey } });
        if (!collectionData) {
            return Promise.reject();
        }

        await message.channel.send(`Floor: ${collectionData.floor_price / convValue}\nTrading Volume: ${(collectionData.volume_traded / convValue).toFixed(2)}`);
    }
};
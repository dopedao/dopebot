const { sfetch } = require("../../util/sfetch");
const { quixoticDwApi, qxEthConvValue } = require("../../constants");
const { quixoticApiKey } = require("../../config.json");

module.exports = {
    name: "qx",
    description: "Quixotic Test commands",
    args: "(1-8000)",
    async execute(message) {
        const collectionData = await sfetch(quixoticDwApi, { headers: { "X-API-KEY": quixoticApiKey } });
        if (!collectionData) {
            return Promise.reject();
        }

        await message.channel.send(`Floor: ${collectionData.floor_price / qxEthConvValue}\nTrading Volume: ${(collectionData.volume_traded / qxEthConvValue).toFixed(2)}`);
    }
};
module.exports = {
        name: "ping",
        description: "pong",
        async execute(message) {
                await message.reply('Pong!');
        }
};

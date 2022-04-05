module.exports = {
    name: "poll",
    description: "Creates a simple poll",
    args: 'question',
    validator: ([question]) => !question,
    async execute(message, question) {
        await message.channel.send(`\`${question.join(' ')}\``).then(poll => {
            poll.react("👍");
            poll.react("👎");
        });
    }
};
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "poll",
    description: "Creates a simple poll",
    args: 'question',
    validator: ([question]) => !question,
    async execute(message, question) {

        const pollEmbed = new MessageEmbed()
            .setTitle("📊 Poll")
            .setColor("ORANGE")
            .setDescription(`**${question.join(' ')}**`)
            .setTimestamp();

        await message.channel.send({ embeds: [pollEmbed] }).then(poll => {
            poll.react("👍");
            poll.react("👎");
        });
    }
};
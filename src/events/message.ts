import { Message } from "discord.js";

export default {
    name: "messageCreate",
    once: false,
    async execute(message: Message): Promise<void> {
        if (message.content.startsWith("wen") && message.content.split(' ').length == 2)
        {
            const date = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US');
            await message.reply(date);
        }
    }
}
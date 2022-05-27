const { SlashCommandBuilder } = require("@discordjs/builders");

const maxLength = 8;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Repeats after you, but cool")
        .addStringOption(option =>
            option.setName("text")
            .setDescription("Text to repeat")
            .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString("text");
        if (text.length > maxLength) {
            await interaction.reply({ content: `Message is too long! Max length: ${maxLength}`, ephmeral: true });
            return;
        }

        let textToSend = "";
        for (let i=0; i<text.length; i++) {
            switch(text[i].toLowerCase()) {
                case 'a':
                    textToSend += "<:zz1:923003930760314890>";
                    break;
                case 'b':
                    textToSend += "<:zz2:923003930538024981>";
                    break;
                case 'c':
                    textToSend += "<:zz3:923003930370261094>";
                    break;
                case 'd':
                    textToSend += "<:zz4:923003930697400320>";
                    break;
                case 'e':
                    textToSend += "<:zz5:923003930689024052>";
                    break;
                case 'f':
                    textToSend += "<:zz6:923003930848423977>";
                    break;
                case 'g':
                    textToSend += "<:zz7:923003931032952852>";
                    break;
                case 'h':
                    textToSend += "<:zz8:923003930793902100>";
                    break;
                case 'i':
                    textToSend += "<:zz9:923003930777112647>";
                    break;
                case 'j':
                    textToSend += "<:zz10:923003930970054757>";
                    break;
                case 'k':
                    textToSend += "<:zz11:923003930856800356>";
                    break;
                case 'l':
                    textToSend += "<:zz12:923003930894553098>";
                    break;
                case 'm':
                    textToSend += "<:zz13:923003930449969194>";
                    break;
                case 'n':
                    textToSend += "<:zz14:923003931204911124>";
                    break;
                case 'o':
                    textToSend += "<:zz15:923003930915516456>";
                    break;
                case 'p':
                    textToSend += "<:zz16:923003931167186994>";
                    break;
                case 'q':
                    textToSend += "<:zz17:923003930672234497>";
                    break;
                case 'r':
                    textToSend += "<:zz18:923003930974257252>";
                    break;
                case 's':
                    textToSend += "<:zz19:923003931083276358>";
                    break;
                case 't':
                    textToSend += "<:zz20:923003931263639592>";
                    break;
                case 'u':
                    textToSend += "<:zz21:923003930919731291>";
                    break;
                case 'v':
                    textToSend += "<:zz22:923003930965860403>";
                    break;
                case 'w':
                    textToSend += "<:zz23:923003930869374987>";
                    break;
                case 'x':
                    textToSend += "<:zz24:923003931171389490>";
                    break;
                case 'y':
                    textToSend += "<:zz25:923003931221700608>";
                    break;
                case 'z':
                    textToSend += "<:zz26:923003931297214474>";
                    break;
                default:
                    textToSend += " ";
                    break;
            }
        }
        await interaction.reply(textToSend);
    }
}


const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('./config.json');
const fs = require('node:fs');
const { createLogger, transports, format } = require('winston');
const { combine, timestamp, label, json } = format;

const logger = createLogger({
        level: "info",
        format: combine(
                timestamp(),
                label({ label: "command-deployer"}),
                json()
                ),
        transports: [ new transports.Console() ]
})

const commands = [];

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
        for (const file of fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`./commands/${folder}/${file}`);
                commands.push(command.data.toJSON());
        }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
        logger.info("Refreshing slash commands");

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
            //Routes.applicationCommands(clientId),
			{ body: commands },
		);

        logger.info("Successfully reloaded slash commands");
	} catch (error) {
        logger.error(error);
	}
})();
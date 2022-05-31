import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v9';
import fs from 'node:fs';
import { createLogger, transports, format } from "winston";
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

const commandFolders = fs.readdirSync("../src/commands");
for (const folder of commandFolders) {
        for (const file of fs.readdirSync(`../src/commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`../src/commands/${folder}/${file}`);
                commands.push(command.default.data.toJSON());
        }
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN!);

/* Delete slash commands (globally)
rest.get(Routes.applicationCommands(clientId))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const delURL = `${Routes.applicationCommands(process.env.CLIENT_ID!)}/${command.id}`;
            promises.push(rest.delete(delURL));
        }
        return Promise.all(promises)
    })
*/

(async () => {
	try {
        logger.info("Refreshing slash commands");
        
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
			{ body: commands },
		);

        logger.info("Successfully reloaded slash commands");
	} catch (error) {
        logger.error(error);
	}
})();
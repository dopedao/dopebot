import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v9';
import fs from 'node:fs';
import { logger } from "../util/logger";

const log = logger("command-deployer");

const commands = [];

log.debug("Loading commands...")
const commandFolders = fs.readdirSync("../commands");
for (const folder of commandFolders) {
        for (const file of fs.readdirSync(`../commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`../commands/${folder}/${file}`);
                commands.push(command.default.data.toJSON());
        }
}
log.debug("Finished loading commands")

const rest = new REST({ version: '9' }).setToken(process.env.DBOT_CLIENT_TOKEN!);

/* Delete slash commands (globally)
rest.get(Routes.applicationCommands(clientId))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const delURL = `${Routes.applicationCommands(process.env.DBOT_CLIENT_ID!)}/${command.id}`;
            promises.push(rest.delete(delURL));
        }
        return Promise.all(promises)
    })
*/

(async () => {
	try {
        log.info("Registering slash commands");
        
		await rest.put(
			Routes.applicationGuildCommands(process.env.DBOT_CLIENT_ID!, process.env.DBOT_GUILD_ID!),
			{ body: commands },
		);

        log.info("Successfully registered slash commands");
	} catch (error: unknown) {
                if (error instanceof Error) {
                        log.error(error.stack);
                }
	}
})();
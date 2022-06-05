import fs from 'node:fs';
import { Client, Collection, Intents } from 'discord.js';
import path from 'path/posix';
import { ICommandCollectionClient } from './interfaces/ICommandCollectionClient';
import { logger } from './util/logger';

const log = logger("Startup");

const client:  ICommandCollectionClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

log.info("Loading commands");
const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
        for (const file of fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))) {
                const command = require(`./commands/${folder}/${file}`);
                client.commands.set(command.default.data.name, command.default);
        }
}
log.info("Finished loading commands");

log.info("Loading events");
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const { default: event } = require(filePath);
        if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
        } else {
                client.on(event.name, (...args) => event.execute(...args));
        }
}
log.info("Finished loading events");

process.on("unhandledRejection", error => {
        log.error(error)
});

client.login(process.env.DBOT_CLIENT_TOKEN);

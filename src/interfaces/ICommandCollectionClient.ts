import { Client, Collection } from "discord.js";

interface CommandCollectionClient extends Client {
        commands?: Collection<any, any>
}

export { CommandCollectionClient as ICommandCollectionClient }

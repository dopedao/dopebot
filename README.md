# DopeBot

A very dope bot for the DopeWars discord ;)

## Scopes And Permissions

### Scopes

- [x] bot
- [x] application.commands

### Permission

- [x] Manage Channels
- [x] Read Messages/View Channels
- [x] Send Messages
- [x] Send Messages in Threads
- [x] Manage Messages
- [x] Embed Links
- [x] Attach Files
- [x] Add Reactions
- [x] Use Slash Commands

## Environment Variables

In order for the bot to work correctly, you need to set the following environment variables:

```
DBOT_CLIENT_TOKEN=
DBOT_TWITTER_BEARER_TOKEN=
DBOT_QX_API_KEY=
DBOT_OS_API_KEY=
DBOT_CLIENT_ID=
DBOT_GUILD_ID=
ENV=test/prod
```

## Running the bot

### Without the DopeWars Api

```docker-compose up bot redis```

### With the DopeWars Api

```docker-compose up bot```

The [Api](https://github.com/dopedao/dope-monorepo/tree/feat/discord-oauth/packages/api) already contains a redis service.

# Example message for the Auth flow through redis-cli

```PUBLISH discord '{"id":"your-discord-id","walletaddress":"test","papercount":0,"dopecount":0,"hustlercount":0,"isog":true}'```

# Adding Commands/Events

If your command does not match an existing command type, you can simply create a new `commandName.ts` file and drop it into the commands folder. It does not matter where you put it, as long as it is in a sub directory of `commands`. Folder names are being ignored, so you can name them as you wish. Events must be dropped into the `events` folder.


# Command Template
```ts
export default {
  data: new SlashCommandBuilder(),  /* https://discordjs.guide/interactions/slash-commands.html#options */
  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.reply("Guten Morgen!");
    } catch(error: unkown) {
      return Promise.reject(error);
    }
  }
}
```

# Event Template
```ts
export default {
  name: "eventName",  /* https://discordjs.guide/creating-your-bot/event-handling.html#event-handling */
  once: true/false, /* The bot logging in is a "once" event, users executing a command is not */
  async execute(arg): Promise<void> { /* arg type depends on which event you chose, for e.g. "guildMemberAdd" will pass a "member: GuildMember" */
    
  }
}
```

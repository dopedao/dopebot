# DopeBot

A very dope bot for the DopeWars discord ;)

## Build

## Scopes And Permissions

### Scopes

- [x] bot

### Permission

- [x] Manage Channels
- [x] Read Messages/View Channels
- [x] Send Messages
- [x] Send Messages in Threads
- [x] Manage Messages
- [x] Embed Links
- [x] Attach Files
- [x] Add Reactions

## Config File

In order for the bot to work correctly, you need a `config.json` file as follows:

```json
{
  "botToken": "",
  "twitterBearerToken": "",
  "quixoticApiKey": ""
}
```

## Starting The Bot

To start the bot simply type `node .`

You should see some general information printed to the console.

## Adding Commands

If your command does not match an existing command type, you can simply create a new `commandName.js` file and drop it into the commands folder. It does not matter where you put it, as long as it is in a sub directory of `commands`. Folder names are being ignored, so you can name them as you wish

For your new command to be correctly picked up, you should use an header like this:

```js
module.exports = {
    name: "os",
    description: "\`daily\` - Shows daily OpenSea stats\n\`weekly\` - Shows weekly OpenSea stats",
    args: "[daily | weekly ]",
    validator: ([option]) => !option || !["daily", "weekly"].includes(option),
    async execute(message, option) {
        let embedToSend = {
            "daily" : await dailyOsStats(),
            "weekly" : await weeklyOsStats()
        };

        await message.channel.send({ embeds: [embedToSend[option]] })
    }
}

...
```
`name` -> !name

`description` -> Needed for the !help and wrong arguments embed

`args` -> Same as above, but optional

`validator` -> It validates the received arguments, which happens before the execute method is run (optional)

`async execute(message, option)` -> The actual method that gets executed, if valid arguments are provided

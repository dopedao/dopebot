# DopeBot

A very dope bot for the DopeWars discord ;)

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

## Running the bot

Build the image first:

```docker build . -t dopebot```

Then run it with:

```docker run -d dopebot```


## Adding Commands

If your command does not match an existing command type, you can simply create a new `commandName.js` file and drop it into the commands folder. It does not matter where you put it, as long as it is in a sub directory of `commands`. Folder names are being ignored, so you can name them as you wish

For your new command to be correctly picked up, you should use an header like this:

# ⚠️ DEPRECATED ⚠️
```js
module.exports = {
    name: "qx",
    description: "\`hustler\` - Quixotic Hustler stats\n\`gear\` - Quixotic Gear stats",
    args: "[hustler | gear] (daily | weekly | monthly)",
    validator: ([collection, timeFrame]) => !collection || !["hustler", "gear"].includes(collection) || !timeFrame || !["daily", "weekly", "monthly"].includes(timeFrame),
    async execute(message, [collection, timeFrame]) {
        const fnMap = {
            "hustler": getHustlerStats,
            "gear": getGearStats
        }

        await fnMap[collection](message, collection, timeFrame);
    }
};

...
```
`name` -> !name of command

`description` -> Needed for the `!dw help` and wrong arguments embed

`args` -> Same as above, but optional

`validator` -> It validates the received arguments, which happens before the execute method is run (optional)

`async execute(message, [args])` -> The actual method that gets executed, if valid arguments are provided

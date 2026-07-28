# Chan Bot

A Discord RP bot built with Discord.js v14 and MongoDB.

## How to run

The bot starts with:
```
node index.js
```

This is configured as the "Start application" workflow.

## Required secrets

Set these in Replit Secrets before starting:

| Key | Description |
|---|---|
| `TOKEN` | Discord bot token |
| `CLIENT_ID` | Discord application/client ID |
| `GUILD_ID` | Discord server (guild) ID |
| `MONGODB_URI` | MongoDB connection string (e.g. from MongoDB Atlas) |

## Deploying slash commands

After adding new commands, register them with Discord by running:
```
node deploy-commands.js
```

## Stack

- **Runtime**: Node.js
- **Discord library**: discord.js v14
- **Database**: MongoDB via Mongoose

## Project structure

```
commands/       Slash commands grouped by category
  economy/
  gambling/
  government/
  roleplay/
  utility/
events/         Discord event handlers
models/         Mongoose schemas
config/         Bot configuration
index.js        Entry point
deploy-commands.js  Slash command registration script
```

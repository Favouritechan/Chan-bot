require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

const mongoose = require("mongoose");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();

// =======================
// LOAD COMMANDS
// =======================

const commandsPath = path.join(__dirname, "commands");

const folders = fs.readdirSync(commandsPath);

for (const folder of folders) {

    const folderPath = path.join(commandsPath, folder);

    const items = fs.readdirSync(folderPath);

    for (const item of items) {

        const itemPath = path.join(folderPath, item);

        if (fs.statSync(itemPath).isDirectory()) {

            const indexFile = path.join(itemPath, "index.js");

            if (fs.existsSync(indexFile)) {

                const command = require(indexFile);

                client.commands.set(command.data.name, command);

            }

        }

        else if (item.endsWith(".js")) {

            const command = require(itemPath);

            client.commands.set(command.data.name, command);

        }

    }

}

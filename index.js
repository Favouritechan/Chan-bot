require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
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

        } else if (item.endsWith(".js")) {

            const command = require(itemPath);
            client.commands.set(command.data.name, command);

        }

    }

}

// =======================
// LOAD EVENTS
// =======================

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {

    const event = require(path.join(eventsPath, file));

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }

}

// =======================
// CONNECT TO MONGODB
// =======================

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(console.error);

// =======================
// LOGIN BOT
// =======================

client.login(process.env.TOKEN);

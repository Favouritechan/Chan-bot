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
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Load Commands
const commandFolders = path.join(__dirname, "commands");

if (fs.existsSync(commandFolders)) {
    const folders = fs.readdirSync(commandFolders);

    for (const folder of folders) {

        const folderPath = path.join(commandFolders, folder);

        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {

            const command = require(path.join(folderPath, file));

            client.commands.set(command.data.name, command);

        }
    }
}

// Load Events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {

    const event = require(`./events/${file}`);

    if (event.once) {

        client.once(event.name, (...args) => event.execute(...args, client));

    } else {

        client.on(event.name, (...args) => event.execute(...args, client));

    }

}

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(console.error);

// Login
client.login(process.env.TOKEN);

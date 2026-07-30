require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];

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

                if (command.data) {
                    commands.push(command.data.toJSON());
                }

            }

        } else if (item.endsWith(".js")) {

            const command = require(itemPath);

            if (command.data) {
                commands.push(command.data.toJSON());
            }

        }

    }

}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log("Registering Slash Commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("✅ Slash Commands Registered!");

    } catch (error) {

        console.error(error);

    }

})();

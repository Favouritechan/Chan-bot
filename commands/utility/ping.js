const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check if Chan Bot is online."),

    async execute(interaction) {
        await interaction.reply({
            content: "🏓 Pong! Chan Bot is online.",
            ephemeral: false
        });
    },
};

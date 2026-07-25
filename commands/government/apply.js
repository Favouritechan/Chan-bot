const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("apply")
        .setDescription("Apply for a government department.")
        .addStringOption(option =>
            option
                .setName("department")
                .setDescription("Choose a department")
                .setRequired(true)
                .addChoices(
                    { name: "👮 Police Department", value: "Police Department" },
                    { name: "🚑 EMS", value: "EMS" },
                    { name: "🪖 Army", value: "Army" },
                    { name: "🏛 Government", value: "Government" },
                    { name: "🎵 Music Industry", value: "Music Industry" }
                )
        ),

    async execute(interaction) {

        const department = interaction.options.getString("department");

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📄 Job Application")
            .setDescription(
                `${interaction.user} has applied for **${department}**.\n\nA recruiter will review your application soon.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

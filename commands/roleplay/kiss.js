const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kiss")
        .setDescription("Kiss another player ❤️")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to kiss?")
                .setRequired(true)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user");

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: "😂 You can't kiss yourself!",
                ephemeral: true
            });
        }

        const responses = [
            "💋 That was a sweet kiss!",
            "🥰 Love is in the air!",
            "❤️ A romantic moment!",
            "😘 They smiled after the kiss!",
            "💕 That was adorable!"
        ];

        const random =
            responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor("#FF69B4")
            .setTitle("💋 Kiss")
            .setDescription(
                `${interaction.user} kissed ${target}!\n\n${random}`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

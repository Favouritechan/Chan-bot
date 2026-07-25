const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fight")
        .setDescription("Fight another player ⚔️")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to fight?")
                .setRequired(true)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user");

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: "😂 You can't fight yourself!",
                ephemeral: true
            });
        }

        const winner =
            Math.random() < 0.5
                ? interaction.user
                : target;

        const loser =
            winner.id === interaction.user.id
                ? target
                : interaction.user;

        const actions = [
            "landed a powerful punch 👊",
            "won with an amazing combo 🥊",
            "dodged every attack 😎",
            "knocked the opponent down 💥",
            "finished the battle with a final strike ⚡"
        ];

        const action =
            actions[Math.floor(Math.random() * actions.length)];

        const embed = new EmbedBuilder()
            .setColor("#E74C3C")
            .setTitle("⚔️ RP Fight")
            .setDescription(
                `${interaction.user} challenged ${target}!\n\n🏆 **Winner:** ${winner}\n💀 **Loser:** ${loser}\n\n${winner} ${action}`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

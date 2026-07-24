const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all available Chan Bot commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#ff69b4")
            .setTitle("📖 Chan Bot Help")
            .setDescription("Welcome to **Chan Bot v1.0**!")
            .addFields(
                {
                    name: "💰 Economy",
                    value: "`/balance`\n`/work`\n`/collect`\n`/give`\n`/transfer`",
                    inline: true
                },
                {
                    name: "🎭 Roleplay",
                    value: "`/eat`\n`/fight`\n`/kiss`",
                    inline: true
                },
                {
                    name: "🎰 Gambling",
                    value: "`/bet`\n`/roulette`\n`/horse-race`\n`/sportybet`",
                    inline: true
                },
                {
                    name: "🛡️ Moderation",
                    value: "`/warn`",
                    inline: true
                },
                {
                    name: "🏛️ Government",
                    value: "`/apply`",
                    inline: true
                },
                {
                    name: "⚙️ Utility",
                    value: "`/ping`\n`/help`",
                    inline: true
                }
            )
            .setFooter({
                text: "Chan Bot v1.0 • Built by Favour"
            });

        await interaction.reply({
            embeds: [embed]
        });

    }
};

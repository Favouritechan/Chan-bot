const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all available Chan Bot commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#ff69b4")
            .setTitle("📖 Chan Bot Help")
            .setDescription(
                "Welcome to **Chan Bot v1.0**!\n" +
                "All commands work with both **/** (slash) and **!** (prefix)."
            )
            .addFields(
                {
                    name: "💰 Economy",
                    value: "`/balance` `!balance`\n`/work` `!work`\n`/daily` `!daily`\n`/give` `!give`\n`/transfer` `!transfer`\n`/deposit` `!deposit`\n`/withdraw` `!withdraw`\n`/buy` `!buy`\n`/leaderboard` `!leaderboard`",
                    inline: true
                },
                {
                    name: "🎭 Roleplay",
                    value: "`/eat` `!eat`\n`/fight` `!fight`\n`/kiss` `!kiss`\n`/steal` `!steal`",
                    inline: true
                },
                {
                    name: "🎰 Gambling",
                    value: "`/bet` `!bet`\n`/roulette` `!roulette`\n`/horse-race` `!horse-race`\n`/sportybet` `!sportybet`",
                    inline: true
                },
                {
                    name: "🛡️ Moderation",
                    value: "`/warn` `!warn`",
                    inline: true
                },
                {
                    name: "🏛️ Government",
                    value: "`/apply` `!apply`",
                    inline: true
                },
                {
                    name: "⚙️ Utility",
                    value: "`/ping` `!ping`\n`/help` `!help`\n`/anonymous` `!anonymous`",
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

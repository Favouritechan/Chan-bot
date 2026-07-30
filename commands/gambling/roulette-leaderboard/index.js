const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../../models/User");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("roulette-leaderboard")
        .setDescription("View the best roulette players."),

    async execute(interaction) {

        const users = await User.find({})
            .sort({ "casino.totalWon": -1 })
            .limit(10);

        if (!users.length) {
            return interaction.reply({
                content: "❌ Nobody has played roulette yet.",
                ephemeral: true
            });
        }

        const leaderboard = users.map((user, index) => {

            const profit =
                user.casino.totalWon - user.casino.totalLost;

            return `**${index + 1}.** <@${user.userId}>
💰 Won: **₦${user.casino.totalWon.toLocaleString()}**
📉 Lost: **₦${user.casino.totalLost.toLocaleString()}**
📈 Profit: **₦${profit.toLocaleString()}**`;

        }).join("\n\n");

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("🏆 Roulette Leaderboard")
            .setDescription(leaderboard)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};

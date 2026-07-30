const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../../models/User");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("rouletteleaderboard")
        .setDescription("View the richest roulette players."),

    async execute(interaction) {

        const users = await User.find({})
            .sort({ wallet: -1 })
            .limit(10);

        if (!users.length) {
            return interaction.reply({
                content: "❌ Nobody is on the leaderboard yet.",
                ephemeral: true
            });
        }

        const leaderboard = users
            .map((user, index) => {

                return `**${index + 1}.** <@${user.userId}> • ₦${user.wallet.toLocaleString()}`;

            })
            .join("\n");

        const embed = new EmbedBuilder()

            .setColor("Gold")

            .setTitle("🏆 Roulette Leaderboard")

            .setDescription(leaderboard)

            .setFooter({
                text: "Chan Casino"
            })

            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }

};

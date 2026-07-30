const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../../models/User");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("roulette-stats")
        .setDescription("View your roulette statistics."),

    async execute(interaction) {

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            user = await User.create({
                userId: interaction.user.id
            });
        }

        const casino = user.casino || {};

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("🎰 Roulette Statistics")
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                {
                    name: "🎮 Games Played",
                    value: `${casino.gamesPlayed || 0}`,
                    inline: true
                },
                {
                    name: "💸 Total Bet",
                    value: `₦${(casino.totalBet || 0).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "💰 Total Won",
                    value: `₦${(casino.totalWon || 0).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "📉 Total Lost",
                    value: `₦${(casino.totalLost || 0).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "🏆 Biggest Win",
                    value: `₦${(casino.biggestWin || 0).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "💀 Biggest Loss",
                    value: `₦${(casino.biggestLoss || 0).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "🔥 Current Streak",
                    value: `${casino.currentStreak || 0}`,
                    inline: true
                },
                {
                    name: "⭐ Best Streak",
                    value: `${casino.bestStreak || 0}`,
                    inline: true
                }
            )
            .setFooter({
                text: "Chan Casino"
            });

        return interaction.reply({
            embeds: [embed]
        });

    }

};

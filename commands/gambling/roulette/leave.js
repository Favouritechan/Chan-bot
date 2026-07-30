const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const RouletteRound = require("../../../models/RouletteRound");
const User = require("../../../models/User");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave the current roulette round before betting closes."),

    async execute(interaction) {

        const round = await RouletteRound.findOne({
            active: true
        });

        if (!round) {
            return interaction.reply({
                content: "❌ There is no active roulette round.",
                ephemeral: true
            });
        }

        const bet = round.bets.find(
            x => x.userId === interaction.user.id
        );

        if (!bet) {
            return interaction.reply({
                content: "❌ You haven't placed a bet.",
                ephemeral: true
            });
        }

        const user = await User.findOne({
            userId: interaction.user.id
        });

        if (user) {
            user.wallet += bet.amount;
            await user.save();
        }

        round.bets = round.bets.filter(
            x => x.userId !== interaction.user.id
        );

        round.totalPot -= bet.amount;
        round.totalBets--;

        round.totalPlayers =
            [...new Set(round.bets.map(x => x.userId))].length;

        await round.save();

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Bet Removed")
            .setDescription(
                `Your **₦${bet.amount.toLocaleString()}** has been refunded to your wallet.`
            );

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

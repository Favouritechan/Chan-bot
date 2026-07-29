const { EmbedBuilder } = require("discord.js");

const RouletteRound = require("../../../models/RouletteRound");
const User = require("../../../models/User");
const {
    spinWheel,
    isWinningBet,
    getMultiplier
} = require("../../../utils/roulette");
const { roulette: casinoConfig, payouts } = require("../../../config/casino");

module.exports = async function startRoulette(client, roundId) {

    const round = await RouletteRound.findById(roundId);

    if (!round) return;

    // Wait for betting to close
    setTimeout(async () => {

      round.active = false;
await round.save();

const channel = await client.channels.fetch(round.channelId).catch(() => null);

if (!channel) return;

const closingEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🚫 No More Bets!")
    .setDescription(
        "🎰 The roulette table is now closed.\n\n" +
        "🎡 The wheel is spinning..."
    );

const spinMessage = await channel.send({
    embeds: [closingEmbed]
});

// Wait 10 seconds for the spinning animation
setTimeout(async () => {

  const result = spinWheel();

const winningNumber = result.number;
const winningColor = result.color;

let winners = [];

    for (const bet of round.bets) {

    const user = await User.findOne({
        userId: bet.userId
    });

    if (!user) continue;

    let multiplier = getMultiplier(bet.choice);

    // Single number (10x)
    if (!isWinningBet(
    bet.choice,
    winningNumber,
    winningColor
)) {

    continue;

}

        const prize = bet.amount * multiplier;

        user.wallet += prize;

        await user.save();

        winners.push(
            `👤 <@${bet.userId}> won **₦${prize.toLocaleString()}**`
        );
    }
}
    const resultEmbed = new EmbedBuilder()
    .setColor("Gold")
    .setTitle("🎰 Roulette Results")
    .addFields(
        {
            name: "🎯 Winning Number",
            value: `${winningNumber}`,
            inline: true
        },
        {
            name: "🎨 Winning Colour",
            value: winningColor.toUpperCase(),
            inline: true
        }
    )
    .setTimestamp();

if (winners.length > 0) {
    resultEmbed.addFields({
        name: "🏆 Winners",
        value: winners.join("\n")
    });
} else {
    resultEmbed.addFields({
        name: "🏆 Winners",
        value: "Nobody won this round."
    });
}

await spinMessage.edit({
    embeds: [resultEmbed]
});

// Delete the finished round
await RouletteRound.findByIdAndDelete(round._id);

    
}, 10000);

    }, casinoConfig.bettingTime * 1000);

};

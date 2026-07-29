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

  // Generate winning number (0-36)
const winningNumber = Math.floor(Math.random() * 37);

// Determine winning colour
let winningColor = "green";

if (winningNumber !== 0) {

    const redNumbers = [
        1,3,5,7,9,12,14,16,18,
        19,21,23,25,27,30,32,34,36
    ];

    winningColor = redNumbers.includes(winningNumber)
        ? "red"
        : "black";
}

let winners = [];

    for (const bet of round.bets) {

    const user = await User.findOne({
        userId: bet.userId
    });

    if (!user) continue;

    let multiplier = 0;

    // Single number (10x)
    if (bet.choice === String(winningNumber)) {
        multiplier = 10;
    }

    // Red / Black (2x)
    else if (bet.choice === winningColor) {
        multiplier = 2;
    }

    // 1-18 (2x)
    else if (
        bet.choice === "1-18" &&
        winningNumber >= 1 &&
        winningNumber <= 18
    ) {
        multiplier = 2;
    }

    // 19-36 (2x)
    else if (
        bet.choice === "19-36" &&
        winningNumber >= 19 &&
        winningNumber <= 36
    ) {
        multiplier = 2;
    }

    // 1-12 (3x)
    else if (
        bet.choice === "1-12" &&
        winningNumber >= 1 &&
        winningNumber <= 12
    ) {
        multiplier = 3;
    }

    // 13-24 (3x)
    else if (
        bet.choice === "13-24" &&
        winningNumber >= 13 &&
        winningNumber <= 24
    ) {
        multiplier = 3;
    }

    // 25-36 (3x)
    else if (
        bet.choice === "25-36" &&
        winningNumber >= 25 &&
        winningNumber <= 36
    ) {
        multiplier = 3;
    }

    if (multiplier > 0) {

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

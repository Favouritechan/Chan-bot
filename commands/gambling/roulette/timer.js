const { EmbedBuilder } = require("discord.js");

const RouletteRound = require("../../../models/RouletteRound");
const User = require("../../../models/User");
const casinoConfig = require("../../../config/casino");

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

}, 10000);

    }, casinoConfig.bettingTime * 1000);

};

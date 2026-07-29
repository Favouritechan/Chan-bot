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

    // Next step goes here

}, 10000);

    }, casinoConfig.bettingTime * 1000);

};

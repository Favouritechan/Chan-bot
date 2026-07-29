const { EmbedBuilder } = require("discord.js");

const RouletteRound = require("../../../models/RouletteRound");
const User = require("../../../models/User");
const casinoConfig = require("../../../config/casino");

module.exports = async function startRoulette(client, roundId) {

    const round = await RouletteRound.findById(roundId);

    if (!round) return;

    // Wait for betting to close
    setTimeout(async () => {

        // We'll continue here in the next step

    }, casinoConfig.bettingTime * 1000);

};

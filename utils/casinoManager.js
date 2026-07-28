const Casino = require("../models/Casino");

async function getCasino() {
    let casino = await Casino.findOne();

    if (!casino) {
        casino = await Casino.create({});
    }

    return casino;
}

async function startGame(game, channelId, messageId = null) {

    const casino = await getCasino();

    if (casino.active) {
        return false;
    }

    casino.active = true;
    casino.activeGame = game;
    casino.channelId = channelId;
    casino.messageId = messageId;
    casino.startedAt = new Date();

    await casino.save();

    return true;
}

async function endGame() {

    const casino = await getCasino();

    casino.active = false;
    casino.activeGame = null;
    casino.channelId = null;
    casino.messageId = null;
    casino.startedAt = null;

    await casino.save();
}

async function isGameRunning() {

    const casino = await getCasino();

    return casino.active;
}

async function getActiveGame() {

    const casino = await getCasino();

    return casino.activeGame;
}

module.exports = {
    getCasino,
    startGame,
    endGame,
    isGameRunning,
    getActiveGame
};

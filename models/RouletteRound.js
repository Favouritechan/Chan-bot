const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 100
    },

    choice: {
        type: String,
        required: true
    },

    placedAt: {
        type: Date,
        default: Date.now
    }
});

const rouletteRoundSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: false
    },

    roundId: {
        type: Number,
        default: 1
    },

    channelId: {
        type: String,
        default: null
    },

    messageId: {
        type: String,
        default: null
    },

    startedAt: {
        type: Date,
        default: null
    },

    bettingEndsAt: {
        type: Date,
        default: null
    },

    spinning: {
        type: Boolean,
        default: false
    },

    totalPot: {
        type: Number,
        default: 0
    },

    totalPlayers: {
        type: Number,
        default: 0
    },

    totalBets: {
        type: Number,
        default: 0
    },

    winningNumber: {
        type: Number,
        default: null
    },

    winningColor: {
        type: String,
        default: null
    },

    bets: [betSchema]

}, {
    timestamps: true
});

module.exports = mongoose.model("RouletteRound", rouletteRoundSchema);

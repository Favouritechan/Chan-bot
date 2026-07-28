const mongoose = require("mongoose");

const casinoSchema = new mongoose.Schema({

    activeGame: {
        type: String,
        default: null
    },

    active: {
        type: Boolean,
        default: false
    },

    channelId: {
        type: String,
        default: null
    },

    messageId: {
        type: String,
        default: null
    },

    roundId: {
        type: Number,
        default: 1
    },

    startedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Casino", casinoSchema);

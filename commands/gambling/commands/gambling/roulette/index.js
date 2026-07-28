const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../../models/User");
const parseBet = require("../../../utils/parseBet");
const casinoConfig = require("../../../config/casino");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Play Multiplayer Roulette")

        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("Bet amount (100, all, half)")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("bet")
                .setDescription("Choose your bet")
                .setRequired(true)
                .addChoices(

                    { name: "🔴 Red", value: "red" },
                    { name: "⚫ Black", value: "black" },

                    { name: "1 - 18", value: "1-18" },
                    { name: "19 - 36", value: "19-36" },

                    { name: "1 - 12", value: "1-12" },
                    { name: "13 - 24", value: "13-24" },
                    { name: "25 - 36", value: "25-36" },

                    { name: "0", value: "0" },

                    { name: "1", value: "1" },
                    { name: "2", value: "2" },
                    { name: "3", value: "3" },
                    { name: "4", value: "4" },
                    { name: "5", value: "5" },
                    { name: "6", value: "6" },
                    { name: "7", value: "7" },
                    { name: "8", value: "8" },
                    { name: "9", value: "9" },
                    { name: "10", value: "10" },
                    { name: "11", value: "11" },
                    { name: "12", value: "12" },
                    { name: "13", value: "13" },
                    { name: "14", value: "14" },
                    { name: "15", value: "15" },
                    { name: "16", value: "16" },
                    { name: "17", value: "17" },
                    { name: "18", value: "18" },
                    { name: "19", value: "19" },
                    { name: "20", value: "20" },
                    { name: "21", value: "21" },
                    { name: "22", value: "22" },
                    { name: "23", value: "23" },
                    { name: "24", value: "24" },
                    { name: "25", value: "25" },
                    { name: "26", value: "26" },
                    { name: "27", value: "27" },
                    { name: "28", value: "28" },
                    { name: "29", value: "29" },
                    { name: "30", value: "30" },
                    { name: "31", value: "31" },
                    { name: "32", value: "32" },
                    { name: "33", value: "33" },
                    { name: "34", value: "34" },
                    { name: "35", value: "35" },
                    { name: "36", value: "36" }

                )
        ),

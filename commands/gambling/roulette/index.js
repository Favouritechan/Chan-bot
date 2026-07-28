const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../../models/User");
const RouletteRound = require("../../../models/RouletteRound");

const {
    isValidChoice
} = require("../../../utils/roulette");

const casinoConfig = require("../../../config/casino");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("roulette")

        .setDescription("Join the live roulette table.")

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

            { name: "🎯 Single Number", value: "number" }
        )
)

.addIntegerOption(option =>
    option
        .setName("number")
        .setDescription("Only required if betting on a single number")
        .setMinValue(0)
        .setMaxValue(36)
        .setRequired(false)
)
        )

        .addStringOption(option =>
            option
                .setName("choice")
                .setDescription("red, black, 1-18, 19-36, 1-12, 13-24, 25-36 or 0-36")
                .setRequired(true)
        ),

    async execute(interaction) {

        const betInput = interaction.options
            .getString("bet")
            .toLowerCase();

        const choice = interaction.options
            .getString("choice")
            .toLowerCase();

        if (!isValidChoice(choice)) {

            return interaction.reply({

                content:
                    "❌ Invalid choice.\n\nValid options:\n• red\n• black\n• 1-18\n• 19-36\n• 1-12\n• 13-24\n• 25-36\n• 0-36",

                ephemeral: true

            });

        }

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {

            user = await User.create({

                userId: interaction.user.id

            });

        }

        let amount;

      if (betInput === "all") {

    amount = user.wallet;

} else if (betInput === "half") {

    amount = Math.floor(user.wallet / 2);

} else {

    amount = Number(betInput.replace(/,/g, ""));

}

        if (isNaN(amount) || amount < casinoConfig.minimumBet) {

            return interaction.reply({

                content:
                    `❌ Minimum bet is ₦${casinoConfig.minimumBet.toLocaleString()}.`,

                ephemeral: true

            });

        }

        if (amount > user.wallet) {

            return interaction.reply({

                content:
                    "❌ You don't have enough money.",

                ephemeral: true

            });

        }

        let round = await RouletteRound.findOne({

            active: true

        });

        if (!round) {

            round = await RouletteRound.create({

                active: true,

                startedAt: new Date(),

                bettingEndsAt:
                    new Date(
                        Date.now() +
                        casinoConfig.bettingTime * 1000
                    )

            });

        }

        user.wallet -= amount;

        await user.save();
        
        const existingBet = round.bets.find(
    bet => bet.userId === interaction.user.id
);

if (existingBet) {

    return interaction.reply({
        content: "❌ You have already placed a bet in this roulette round.",
        ephemeral: true
    });

}

        round.bets.push({

            userId: interaction.user.id,

            username: interaction.user.username,

            amount,

            choice

        });

        round.totalPot += amount;

        round.totalBets++;

        round.totalPlayers =
            [...new Set(round.bets.map(x => x.userId))].length;

        await round.save();

        const embed = new EmbedBuilder()

            .setColor("Gold")

            .setTitle("🎰 Chan Casino")

            .setDescription(

                `✅ Your bet has been placed!\n\n` +

                `💰 Bet: **₦${amount.toLocaleString()}**\n` +

                `🎯 Choice: **${choice}**\n\n` +

                `⏳ Betting closes in **${casinoConfig.bettingTime} seconds**.`

            )

            .setFooter({

                text:
                    `Round Players: ${round.totalPlayers} | Bets: ${round.totalBets}`

            });

        return interaction.reply({

            embeds: [embed],

            ephemeral: true

        });

    }

};

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../../models/User");
const RouletteRound = require("../../../models/RouletteRound");

const casinoConfig = require("../../../config/casino");

module.exports = {

    data: new SlashCommandBuilder()

    .setName("roulette")

    .setDescription("Join the live roulette table.")

    .addStringOption(option =>
        option
            .setName("amount")
            .setDescription("Amount to bet (100, all, half)")
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
                { name: "🎯 Single Number", value: "number" }
            )
    )

    .addIntegerOption(option =>
        option
            .setName("number")
            .setDescription("Only for Single Number")
            .setMinValue(0)
            .setMaxValue(36)
            .setRequired(false)
    ),

    async execute(interaction) {

        const amountInput = interaction.options
    .getString("amount")
    .toLowerCase();

const choice = interaction.options
    .getString("bet")
    .toLowerCase();

const number = interaction.options.getInteger("number");

        if (choice === "number" && (number === null || number < 0 || number > 36)) {

    return interaction.reply({
        content: "❌ Please choose a number between 0 and 36.",
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

switch (amountInput) {

    case "all":
        amount = user.wallet;
        break;

    case "half":
        amount = Math.floor(user.wallet / 2);
        break;

    default:
        amount = Number(amountInput.replace(/,/g, ""));
        break;

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
    channelId: interaction.channel.id,
    startedAt: new Date(),
    bettingEndsAt: new Date(
        Date.now() + casinoConfig.bettingTime * 1000
    )
});

        }

        
        const existingBet = round.bets.find(
    bet => bet.userId === interaction.user.id
);

if (existingBet) {

    return interaction.reply({
        content: "❌ You have already placed a bet in this roulette round.",
        ephemeral: true
    });

}

        user.wallet -= amount;
await user.save();

round.bets.push({

    userId: interaction.user.id,

    username: interaction.user.username,

    amount,

    choice:
    choice === "number"
        ? String(number)
        : choice

});

        round.totalPot += amount;

        round.totalBets++;

        round.totalPlayers =
            [...new Set(round.bets.map(x => x.userId))].length;

        await round.save();
        const startRoulette = require("./timer.js");

if (round.totalBets === 1) {
    startRoulette(interaction.client, round._id);
}

        const embed = new EmbedBuilder()

            .setColor("Gold")

            .setTitle("🎰 Chan Casino")

            .setDescription(

                `✅ Your bet has been placed!\n\n` +

                `💰 Bet: **₦${amount.toLocaleString()}**\n` +

                `🎯 Choice: **${choice === "number" ? number : choice}**\n\n` +

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

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bet")
        .setDescription("Bet money for a chance to win double.")
        .addStringOption(option =>
    option
        .setName("amount")
        .setDescription("Amount, all or half")
        .setRequired(true)
)
        ),

    async execute(interaction) {

        const amountInput = interaction.options.getString("amount").toLowerCase();

let amount;

if (amountInput === "all") {
    amount = user.wallet;
} else if (amountInput === "half") {
    amount = Math.floor(user.wallet / 2);
} else {
    amount = Number(amountInput.replace(/,/g, ""));
}

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            user = await User.create({
                userId: interaction.user.id
            });
        }

        if (amount <= 0) {
            return interaction.reply({
                content: "❌ Enter a valid amount.",
                ephemeral: true
            });
        }

        if (user.wallet < amount) {
            return interaction.reply({
                content: "❌ You don't have enough money.",
                ephemeral: true
            });
        }

        const win = Math.random() < 0.5;

        const embed = new EmbedBuilder();

        if (win) {

            user.wallet += amount;

            embed
                .setColor("Green")
                .setTitle("🎉 You Won!")
                .setDescription(
                    `You won **₦${amount.toLocaleString()}**!\n\nNew Wallet: **₦${user.wallet.toLocaleString()}**`
                );

        } else {

            user.wallet -= amount;

            embed
                .setColor("Red")
                .setTitle("💸 You Lost!")
                .setDescription(
                    `You lost **₦${amount.toLocaleString()}**.\n\nNew Wallet: **₦${user.wallet.toLocaleString()}**`
                );

        }

        await user.save();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

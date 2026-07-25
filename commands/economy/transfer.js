const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer money between your wallet and bank.")
        .addStringOption(option =>
            option
                .setName("from")
                .setDescription("Where to transfer from")
                .setRequired(true)
                .addChoices(
                    { name: "Wallet", value: "wallet" },
                    { name: "Bank", value: "bank" }
                )
        )
        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("Amount or 'all'")
                .setRequired(true)
        ),

    async execute(interaction) {

        const from = interaction.options.getString("from");
        const amountInput = interaction.options.getString("amount");

        let user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            user = await User.create({ userId: interaction.user.id });
        }

        let amount;

        if (amountInput.toLowerCase() === "all") {
            amount = from === "wallet" ? user.wallet : user.bank;
        } else {
            amount = parseInt(amountInput);

            if (isNaN(amount) || amount <= 0) {
                return interaction.reply({
                    content: "❌ Enter a valid amount.",
                    ephemeral: true
                });
            }
        }

        if (from === "wallet") {

            if (user.wallet < amount) {
                return interaction.reply({
                    content: "❌ Not enough money in your wallet.",
                    ephemeral: true
                });
            }

            user.wallet -= amount;
            user.bank += amount;

        } else {

            if (user.bank < amount) {
                return interaction.reply({
                    content: "❌ Not enough money in your bank.",
                    ephemeral: true
                });
            }

            user.bank -= amount;
            user.wallet += amount;

        }

        await user.save();

        const embed = new EmbedBuilder()
            .setColor("#3498DB")
            .setTitle("💳 Transfer Complete")
            .setDescription(`Successfully transferred **₦${amount.toLocaleString()}**.`)
            .addFields(
                {
                    name: "👛 Wallet",
                    value: `₦${user.wallet.toLocaleString()}`,
                    inline: true
                },
                {
                    name: "🏦 Bank",
                    value: `₦${user.bank.toLocaleString()}`,
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

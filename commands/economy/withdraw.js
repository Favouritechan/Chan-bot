const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw money from your bank.")
        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("Amount to withdraw or 'all'")
                .setRequired(true)
        ),

    async execute(interaction) {
        const amount = interaction.options.getString("amount");

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "❌ You don't have an account yet.",
                ephemeral: true
            });
        }

        let withdrawAmount;

        if (amount.toLowerCase() === "all") {
            withdrawAmount = user.bank;
        } else {
            withdrawAmount = parseInt(amount);

            if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
                return interaction.reply({
                    content: "❌ Enter a valid amount.",
                    ephemeral: true
                });
            }
        }

        if (withdrawAmount > user.bank) {
            return interaction.reply({
                content: "❌ You don't have enough money in your bank.",
                ephemeral: true
            });
        }

        user.bank -= withdrawAmount;
        user.wallet += withdrawAmount;

        await user.save();

        const embed = new EmbedBuilder()
            .setColor("#0099FF")
            .setTitle("💸 Withdrawal Successful")
            .setDescription(`You withdrew **₦${withdrawAmount.toLocaleString()}** from your bank.`)
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
            .setFooter({
                text: `Requested by ${interaction.user.username}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};

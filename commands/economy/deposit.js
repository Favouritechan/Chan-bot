const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money into your bank.")
        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("Amount to deposit or 'all'")
                .setRequired(true)
        ),

    async execute(interaction) {
        const amount = interaction.options.getString("amount");

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "❌ You don't have an account yet. Use **/work** first.",
                ephemeral: true
            });
        }

        let depositAmount;

        if (amount.toLowerCase() === "all") {
            depositAmount = user.wallet;
        } else {
            depositAmount = parseInt(amount);

            if (isNaN(depositAmount) || depositAmount <= 0) {
                return interaction.reply({
                    content: "❌ Enter a valid amount.",
                    ephemeral: true
                });
            }
        }

        if (depositAmount > user.wallet) {
            return interaction.reply({
                content: "❌ You don't have that much money in your wallet.",
                ephemeral: true
            });
        }

        user.wallet -= depositAmount;
        user.bank += depositAmount;

        await user.save();

        const embed = new EmbedBuilder()
            .setColor("#00C853")
            .setTitle("🏦 Deposit Successful")
            .setDescription(`You deposited **₦${depositAmount.toLocaleString()}** into your bank.`)
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

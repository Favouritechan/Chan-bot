const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("give")
        .setDescription("Give money to another player.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The player to give money to")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount to give")
                .setRequired(true)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: "❌ You cannot give money to yourself.",
                ephemeral: true
            });
        }

        if (amount <= 0) {
            return interaction.reply({
                content: "❌ Enter a valid amount.",
                ephemeral: true
            });
        }

        let sender = await User.findOne({ userId: interaction.user.id });

        if (!sender) {
            sender = await User.create({ userId: interaction.user.id });
        }

        let receiver = await User.findOne({ userId: target.id });

        if (!receiver) {
            receiver = await User.create({ userId: target.id });
        }

        if (sender.wallet < amount) {
            return interaction.reply({
                content: "❌ You don't have enough money.",
                ephemeral: true
            });
        }

        sender.wallet -= amount;
        receiver.wallet += amount;

        await sender.save();
        await receiver.save();

        const embed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle("💸 Money Sent")
            .setDescription(
                `You sent **₦${amount.toLocaleString()}** to ${target}.`
            )
            .addFields({
                name: "👛 Remaining Wallet",
                value: `₦${sender.wallet.toLocaleString()}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit money into your bank.")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Amount to deposit")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    let user = await User.findOne({
      userId: interaction.user.id
    });

    if (!user) {
      return interaction.reply({
        content: "You don't have an account yet. Use **/work** first.",
        ephemeral: true
      });
    }

    if (amount <= 0) {
      return interaction.reply({
        content: "Please enter a valid amount.",
        ephemeral: true
      });
    }

    if (user.wallet < amount) {
      return interaction.reply({
        content: "You don't have enough money in your wallet.",
        ephemeral: true
      });
    }

    user.wallet -= amount;
    user.bank += amount;

    await user.save();

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("🏦 Deposit Successful")
      .setDescription(`You deposited **₦${amount.toLocaleString()}**.`)
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

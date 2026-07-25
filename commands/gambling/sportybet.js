const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sportybet")
    .setDescription("Place a football bet.")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Amount to bet")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    let user = await User.findOne({
      userId: interaction.user.id
    });

    if (!user) {
      user = await User.create({
        userId: interaction.user.id
      });
    }

    if (amount <= 0)
      return interaction.reply({
        content: "Enter a valid amount.",
        ephemeral: true
      });

    if (user.wallet < amount)
      return interaction.reply({
        content: "You don't have enough money.",
        ephemeral: true
      });

    const win = Math.random() < 0.45;

    const embed = new EmbedBuilder()
      .setTitle("⚽ SportyBet");

    if (win) {
      const winnings = amount * 2;
      user.wallet += winnings;

      embed
        .setColor("Green")
        .setDescription(
          `🎉 Your bet won!\n\nYou earned **₦${winnings.toLocaleString()}**.`
        );
    } else {
      user.wallet -= amount;

      embed
        .setColor("Red")
        .setDescription(
          `❌ Your bet lost.\n\nYou lost **₦${amount.toLocaleString()}**.`
        );
    }

    await user.save();

    await interaction.reply({
      embeds: [embed]
    });
  }
};

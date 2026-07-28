const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roulette")
    .setDescription("Play Russian Roulette.")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Amount to bet")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    let user = await User.findOne({ userId: interaction.user.id });

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

    const win = Math.random() < 0.17;

    const embed = new EmbedBuilder();

    if (win) {
      user.wallet += amount * 5;

      embed
        .setColor("Green")
        .setTitle("🔫 Lucky Shot!")
        .setDescription(
          `You survived and won **₦${(amount * 5).toLocaleString()}!**`
        );
    } else {
      user.wallet -= amount;

      embed
        .setColor("Red")
        .setTitle("💀 Bang!")
        .setDescription(
          `You lost **₦${amount.toLocaleString()}**. Better luck next time.`
        );
    }

    await user.save();

    await interaction.reply({
      embeds: [embed]
    });
  }
};

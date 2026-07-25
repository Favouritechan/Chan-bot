const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("horse-race")
    .setDescription("Bet on a horse race.")
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

    const horses = ["🐎 Red", "🐎 Blue", "🐎 Black", "🐎 White"];
    const winner = horses[Math.floor(Math.random() * horses.length)];
    const playerHorse = horses[Math.floor(Math.random() * horses.length)];

    const embed = new EmbedBuilder()
      .setTitle("🏇 Horse Race")
      .addFields(
        { name: "Your Horse", value: playerHorse, inline: true },
        { name: "Winning Horse", value: winner, inline: true }
      );

    if (playerHorse === winner) {
      user.wallet += amount * 3;
      embed
        .setColor("Green")
        .setDescription(`🎉 You won **₦${(amount * 3).toLocaleString()}!**`);
    } else {
      user.wallet -= amount;
      embed
        .setColor("Red")
        .setDescription(`😢 You lost **₦${amount.toLocaleString()}**.`);
    }

    await user.save();

    await interaction.reply({
      embeds: [embed]
    });
  }
};

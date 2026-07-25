const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const jobs = [
  { name: "Taxi Driver", pay: 300 },
  { name: "Police Officer", pay: 500 },
  { name: "Doctor", pay: 700 },
  { name: "Lawyer", pay: 900 },
  { name: "Mechanic", pay: 400 },
  { name: "Streamer", pay: 1000 }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to earn money."),

  async execute(interaction) {
    let user = await User.findOne({
      userId: interaction.user.id
    });

    if (!user) {
      user = await User.create({
        userId: interaction.user.id
      });
    }

    const job = jobs[Math.floor(Math.random() * jobs.length)];

    user.wallet += job.pay;
    user.job = job.name;

    await user.save();

    const embed = new EmbedBuilder()
      .setColor("#00FF66")
      .setTitle("💼 You Worked!")
      .setDescription(
        `You worked as **${job.name}** and earned **₦${job.pay.toLocaleString()}**.`
      )
      .addFields({
        name: "💰 New Wallet Balance",
        value: `₦${user.wallet.toLocaleString()}`
      })
      .setFooter({
        text: `${interaction.user.username}`
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  }
};

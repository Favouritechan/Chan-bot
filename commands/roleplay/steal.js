const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("steal")
        .setDescription("Attempt to steal money from another player.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to steal from?")
                .setRequired(true)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user");

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: "❌ You can't steal from yourself.",
                ephemeral: true
            });
        }

        let thief = await User.findOne({ userId: interaction.user.id });
        let victim = await User.findOne({ userId: target.id });

        if (!thief) thief = await User.create({ userId: interaction.user.id });
        if (!victim) victim = await User.create({ userId: target.id });

        if (victim.wallet < 100) {
            return interaction.reply({
                content: "❌ That player doesn't have enough money to steal.",
                ephemeral: true
            });
        }

        const success = Math.random() < 0.5;

        if (success) {

            const amount = Math.floor(Math.random() * 500) + 100;

            const stolen = Math.min(amount, victim.wallet);

            victim.wallet -= stolen;
            thief.wallet += stolen;

            await thief.save();
            await victim.save();

            const embed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setTitle("🕵️ Successful Theft")
                .setDescription(
                    `${interaction.user} successfully stole **₦${stolen.toLocaleString()}** from ${target}!`
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });

        } else {

            const fine = 300;

            thief.wallet = Math.max(0, thief.wallet - fine);

            await thief.save();

            const embed = new EmbedBuilder()
                .setColor("#E74C3C")
                .setTitle("🚔 Caught!")
                .setDescription(
                    `${interaction.user} was caught trying to steal from ${target}.\n\nYou paid a **₦${fine.toLocaleString()}** fine.`
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });

        }

    }
};

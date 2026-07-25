const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const COOLDOWN = 60 * 60 * 1000; // 1 hour

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

        if (user.lastWork && Date.now() - user.lastWork.getTime() < COOLDOWN) {

            const timeLeft = Math.ceil(
                (COOLDOWN - (Date.now() - user.lastWork.getTime())) / 60000
            );

            return interaction.reply({
                content: `⏳ You have already worked. Try again in **${timeLeft} minute(s)**.`,
                ephemeral: true
            });
        }

        const jobs = [
            "Police Officer",
            "Taxi Driver",
            "Doctor",
            "Mechanic",
            "Lawyer",
            "Farmer",
            "Truck Driver",
            "Chef",
            "Security Guard",
            "Programmer"
        ];

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earnings = Math.floor(Math.random() * 4500) + 500;

        user.wallet += earnings;
        user.job = job;
        user.lastWork = new Date();

        await user.save();

        const embed = new EmbedBuilder()
            .setColor("#00C853")
            .setTitle("💼 You Worked!")
            .setDescription(
                `You worked as a **${job}** and earned **₦${earnings.toLocaleString()}**.`
            )
            .addFields({
                name: "👛 New Wallet Balance",
                value: `₦${user.wallet.toLocaleString()}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};

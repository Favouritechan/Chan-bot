const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Claim your daily reward."),

    async execute(interaction) {

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            user = await User.create({
                userId: interaction.user.id
            });
        }

        const reward = 5000;
        const cooldown = 24 * 60 * 60 * 1000;

        if (user.lastDaily && Date.now() - user.lastDaily < cooldown) {

            const remaining = cooldown - (Date.now() - user.lastDaily);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);

            return interaction.reply({
                content: `⏳ You already claimed your daily reward.\nCome back in **${hours}h ${minutes}m**.`,
                ephemeral: true
            });
        }

        user.wallet += reward;
        user.lastDaily = Date.now();

        await user.save();

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🎁 Daily Reward")
            .setDescription(`You received **₦${reward.toLocaleString()}!**`)
            .addFields({
                name: "👛 Wallet",
                value: `₦${user.wallet.toLocaleString()}`,
                inline: true
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("View your wallet and bank balance."),

    async execute(interaction) {

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            user = await User.create({
                userId: interaction.user.id
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("💰 Balance")
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                {
                    name: "👛 Wallet",
                    value: `₦${user.wallet.toLocaleString()}`
                    inline: true
                },
                {
                    name: "🏦 Bank",
                    value: `₦${user.bank.toLocaleString()}`,
                    inline: true
                },
                {
                    name: "💼 Job",
                    value: user.job,
                    inline: false
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

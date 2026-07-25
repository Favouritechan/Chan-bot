const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View the richest players."),

    async execute(interaction) {

        const users = await User.find()
            .sort({ bank: -1, wallet: -1 })
            .limit(10);

        const leaderboard = [];

        for (let i = 0; i < users.length; i++) {

            let member;

            try {
                member = await interaction.client.users.fetch(users[i].userId);
            } catch {
                member = { username: "Unknown User" };
            }

            leaderboard.push(
                `**${i + 1}.** ${member.username}\n💰 ₦${(users[i].wallet + users[i].bank).toLocaleString()}`
            );
        }

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🏆 Richest Players")
            .setDescription(
                leaderboard.length
                    ? leaderboard.join("\n\n")
                    : "Nobody is on the leaderboard yet."
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};

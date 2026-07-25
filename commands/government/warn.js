const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to warn")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the warning")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const member = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const embed = new EmbedBuilder()
            .setColor("#FF9900")
            .setTitle("⚠️ Member Warned")
            .addFields(
                {
                    name: "Member",
                    value: `${member}`,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        try {
            await member.send(
                `⚠️ You have been warned in **${interaction.guild.name}**.\nReason: **${reason}**`
            );
        } catch (err) {
            // Ignore if DMs are closed
        }
    }
};

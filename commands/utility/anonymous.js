const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anonymous")
        .setDescription("Send an anonymous message.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Channel to send the message")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Anonymous message")
                .setRequired(true)
        ),

    async execute(interaction) {

        const channel = interaction.options.getChannel("channel");
        const message = interaction.options.getString("message");

        const embed = new EmbedBuilder()
            .setColor("#2F3136")
            .setTitle("📩 Anonymous Message")
            .setDescription(message)
            .setFooter({
                text: "Sent anonymously"
            })
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });

        await interaction.reply({
            content: "✅ Your anonymous message has been sent.",
            ephemeral: true
        });

    }
};

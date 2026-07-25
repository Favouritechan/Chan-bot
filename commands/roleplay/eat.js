const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const foods = [
    "🍔 Burger",
    "🍕 Pizza",
    "🌭 Hot Dog",
    "🍟 Fries",
    "🥩 Steak",
    "🍗 Chicken",
    "🌮 Taco",
    "🍜 Noodles",
    "🍣 Sushi",
    "🥙 Shawarma"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eat")
        .setDescription("Eat something delicious!"),

    async execute(interaction) {

        const food = foods[Math.floor(Math.random() * foods.length)];

        const embed = new EmbedBuilder()
            .setColor("#F39C12")
            .setTitle("🍽️ Meal Time")
            .setDescription(
                `${interaction.user} enjoyed **${food}**!\n\n😋 Hunger restored.\n❤️ You feel refreshed and ready to continue your RP journey.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

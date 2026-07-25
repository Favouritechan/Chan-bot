const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const shop = {
    burger: 500,
    water: 250,
    medkit: 5000,
    fishingrod: 10000,
    pickaxe: 15000,
    laptop: 30000,
    phone: 15000
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item from the shop.")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Item to buy")
                .setRequired(true)
                .addChoices(
                    { name: "🍔 Burger - ₦500", value: "burger" },
                    { name: "💧 Water - ₦250", value: "water" },
                    { name: "🩹 Medkit - ₦5,000", value: "medkit" },
                    { name: "🎣 Fishing Rod - ₦10,000", value: "fishingrod" },
                    { name: "⛏️ Pickaxe - ₦15,000", value: "pickaxe" },
                    { name: "💻 Laptop - ₦30,000", value: "laptop" },
                    { name: "📱 Phone - ₦15,000", value: "phone" }
                )
        ),

    async execute(interaction) {

        const item = interaction.options.getString("item");

        let user = await User.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            user = await User.create({
                userId: interaction.user.id
            });
        }

        const price = shop[item];

        if (user.wallet < price) {
            return interaction.reply({
                content: "❌ You don't have enough money.",
                ephemeral: true
            });
        }

        user.wallet -= price;

        if (!user.inventory) user.inventory = [];

        user.inventory.push(item);

        await user.save();

        const embed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle("🛒 Purchase Successful")
            .setDescription(
                `You bought **${item}** for **₦${price.toLocaleString()}**.`
            )
            .addFields({
                name: "👛 Wallet",
                value: `₦${user.wallet.toLocaleString()}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};

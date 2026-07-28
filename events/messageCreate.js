const { Events } = require("discord.js");

const PREFIX = "!";

// Discord slash command option types
const OptionType = {
    STRING: 3,
    INTEGER: 4,
    USER: 6,
};

/**
 * Parse positional message args into a named options map,
 * pre-resolving USER mentions asynchronously.
 */
async function buildOptions(message, commandData, args) {
    const schema = commandData.options || [];
    const resolved = {};

    for (let i = 0; i < schema.length; i++) {
        const opt = schema[i];
        const raw = args[i];

        if (raw === undefined) break;

        if (opt.type === OptionType.USER) {
            // Accept a mention (<@123>) or a raw user ID
            const match = raw.match(/^<@!?(\d+)>$/);
            const userId = match ? match[1] : raw;
            try {
                resolved[opt.name] = await message.client.users.fetch(userId);
            } catch {
                resolved[opt.name] = null;
            }
        } else if (opt.type === OptionType.INTEGER) {
            const n = parseInt(raw, 10);
            resolved[opt.name] = isNaN(n) ? null : n;
        } else {
            // STRING (and anything else) — pass through as-is
            resolved[opt.name] = raw;
        }
    }

    return resolved;
}

/**
 * Wrap a Message so commands written for slash interactions work unchanged.
 */
function buildFakeInteraction(message, commandData, resolvedOptions) {
    return {
        user: message.author,
        member: message.member,
        guild: message.guild,
        channel: message.channel,
        client: message.client,
        commandName: commandData.name,

        reply: async (data) => {
            if (typeof data === "string") return message.reply(data);
            // ephemeral has no meaning in prefix context — just drop it
            const { ephemeral, ...rest } = data;
            return message.reply(rest);
        },

        options: {
            getString: (name) => resolvedOptions[name] ?? null,
            getInteger: (name) => resolvedOptions[name] ?? null,
            getNumber:  (name) => resolvedOptions[name] ?? null,
            getUser:    (name) => resolvedOptions[name] ?? null,
            getBoolean: (name) => resolvedOptions[name] ?? null,
        },
    };
}

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        // Ignore bots and messages without the prefix
        if (message.author.bot) return;
        if (!message.content.startsWith(PREFIX)) return;

        const [rawName, ...args] = message.content
            .slice(PREFIX.length)
            .trim()
            .split(/\s+/);

        if (!rawName) return;

        const commandName = rawName.toLowerCase();
        const command = message.client.commands.get(commandName);

        if (!command) return;

        try {
            const resolvedOptions = await buildOptions(message, command.data, args);
            const fakeInteraction = buildFakeInteraction(message, command.data, resolvedOptions);
            await command.execute(fakeInteraction);
        } catch (error) {
            console.error(`Prefix command error (${commandName}):`, error);
            await message.reply("❌ There was an error while executing that command.");
        }
    },
};

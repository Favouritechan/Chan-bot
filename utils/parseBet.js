function parseBet(input, wallet) {

    input = input.toLowerCase().trim();

    if (input === "all") {
        return wallet;
    }

    if (input === "half") {
        return Math.floor(wallet / 2);
    }

    if (input.endsWith("%")) {

        const percent = Number(input.replace("%", ""));

        if (
            isNaN(percent) ||
            percent <= 0 ||
            percent > 100
        ) return null;

        return Math.floor(wallet * (percent / 100));
    }

    const amount = Number(input.replace(/,/g, ""));

    if (isNaN(amount))
        return null;

    return amount;
}

module.exports = parseBet;

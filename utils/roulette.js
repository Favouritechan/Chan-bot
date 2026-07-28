const RED_NUMBERS = [
    1, 3, 5, 7, 9,
    12, 14, 16, 18,
    19, 21, 23, 25,
    27, 30, 32, 34, 36
];

const BLACK_NUMBERS = [
    2, 4, 6, 8, 10,
    11, 13, 15, 17,
    20, 22, 24, 26,
    28, 29, 31, 33, 35
];

function spinWheel() {
    const number = Math.floor(Math.random() * 37);

    let color = "green";

    if (RED_NUMBERS.includes(number)) color = "red";
    if (BLACK_NUMBERS.includes(number)) color = "black";

    return {
        number,
        color
    };
}

function getMultiplier(choice) {

    choice = choice.toLowerCase();

    if (choice === "red") return 2;
    if (choice === "black") return 2;

    if (choice === "1-18") return 2;
    if (choice === "19-36") return 2;

    if (choice === "1-12") return 3;
    if (choice === "13-24") return 3;
    if (choice === "25-36") return 3;

    if (!isNaN(choice)) {
        const num = Number(choice);

        if (num >= 0 && num <= 36)
            return 10;
    }

    return 0;
}

function isWinningBet(choice, winningNumber, winningColor) {

    choice = choice.toLowerCase();

    if (choice === "red")
        return winningColor === "red";

    if (choice === "black")
        return winningColor === "black";

    if (choice === "1-18")
        return winningNumber >= 1 && winningNumber <= 18;

    if (choice === "19-36")
        return winningNumber >= 19 && winningNumber <= 36;

    if (choice === "1-12")
        return winningNumber >= 1 && winningNumber <= 12;

    if (choice === "13-24")
        return winningNumber >= 13 && winningNumber <= 24;

    if (choice === "25-36")
        return winningNumber >= 25 && winningNumber <= 36;

    if (!isNaN(choice))
        return Number(choice) === winningNumber;

    return false;
}

function isValidChoice(choice) {

    choice = choice.toLowerCase();

    if ([
        "red",
        "black",
        "1-18",
        "19-36",
        "1-12",
        "13-24",
        "25-36"
    ].includes(choice))
        return true;

    if (!isNaN(choice)) {

        const num = Number(choice);

        return num >= 0 && num <= 36;
    }

    return false;
}

module.exports = {
    RED_NUMBERS,
    BLACK_NUMBERS,
    spinWheel,
    getMultiplier,
    isWinningBet,
    isValidChoice
};

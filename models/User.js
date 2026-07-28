const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },

  wallet: {
    type: Number,
    default: 1000
  },

  bank: {
    type: Number,
    default: 0
  },
  
casino: {
    gamesPlayed: {
        type: Number,
        default: 0
    },

    totalBet: {
        type: Number,
        default: 0
    },

    totalWon: {
        type: Number,
        default: 0
    },

    totalLost: {
        type: Number,
        default: 0
    },

    biggestWin: {
        type: Number,
        default: 0
    },

    biggestLoss: {
        type: Number,
        default: 0
    },

    currentStreak: {
        type: Number,
        default: 0
    },

    bestStreak: {
        type: Number,
        default: 0
    }
},
  job: {
    type: String,
    default: "Unemployed"
  },

  inventory: {
    type: [String],
    default: []
  },

  lastDaily: {
    type: Number,
    default: 0
  },

  level: {
    type: Number,
    default: 1
  },

  xp: {
    type: Number,
    default: 0
  },

  lastWork: {
    type: Date,
    default: null
  },

  lastCollect: {
    type: Date,
    default: null
  },

  // ==========================
  // ROULETTE STATISTICS
  // ==========================

  rouletteGames: {
    type: Number,
    default: 0
  },

  rouletteWins: {
    type: Number,
    default: 0
  },

  rouletteLosses: {
    type: Number,
    default: 0
  },

  rouletteTotalWon: {
    type: Number,
    default: 0
  },

  rouletteTotalLost: {
    type: Number,
    default: 0
  },

  rouletteBiggestWin: {
    type: Number,
    default: 0
  },

  rouletteBiggestLoss: {
    type: Number,
    default: 0
  },

  rouletteCurrentStreak: {
    type: Number,
    default: 0
  },

  rouletteBestStreak: {
    type: Number,
    default: 0
  },

  rouletteTotalBets: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

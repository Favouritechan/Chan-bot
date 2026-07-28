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
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

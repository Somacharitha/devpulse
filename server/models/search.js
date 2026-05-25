const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Search", searchSchema);
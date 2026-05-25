const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  avatar: {
    type: String
  },

  profileUrl: {
    type: String
  },

  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
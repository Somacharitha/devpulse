const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

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
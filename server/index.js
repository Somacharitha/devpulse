const express = require('express');
const cors = require('cors');
const githubRoutes = require('./routes/github');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', githubRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('DevPulse API is running 🚀');
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
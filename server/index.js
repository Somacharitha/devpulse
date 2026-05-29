require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const githubRoutes = require("./routes/github");
const authRoutes = require('./routes/auth');

const app = express();
const limiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    message:
      "Too many requests. Please try again later."
  }

});

connectDB();

app.use(cors());
app.use(limiter);
app.use(express.json());


app.get("/", (req, res) => {
  res.send("DevPulse API Running");
});
app.use("/api/github", githubRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
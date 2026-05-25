require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const githubRoutes = require("./routes/github");
const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use(cors());
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
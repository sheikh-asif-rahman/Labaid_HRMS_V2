const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/dbConfig");
const loginRoute = require("./routes/LoginRoute");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Must be before routes

// Routes
app.use("/api", loginRoute);

// DB connection
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection failed:", err));

app.listen(port, () => console.log(`Server running on port ${port}`));

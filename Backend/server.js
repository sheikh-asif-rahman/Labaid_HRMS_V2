// backend/server.js
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/dbConfig");

// Import routes
const loginRoute = require("./routes/LoginRoute");
const thismonthstatus = require("./routes/HomePageRoutes/ThisMonthStatusRoute");
const todaysattendance = require("./routes/HomePageRoutes/TodaysAttendanceRoute");
const usershortprofile = require("./routes/HomePageRoutes/UserShortProfileRoute");
const recentleaveapplication = require("./routes/HomePageRoutes/RecentLeaveApplicationRoute");
const overviewRoute = require("./routes/OverViewRoute"); // ✅ Match filename exactly

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", loginRoute);
app.use("/api", thismonthstatus);
app.use("/api", todaysattendance);
app.use("/api", usershortprofile);
app.use("/api", recentleaveapplication);
app.use("/api", overviewRoute); // ✅ Overview route

// Database connection
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection failed:", err));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

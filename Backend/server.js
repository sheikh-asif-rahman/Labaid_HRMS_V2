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
const overviewRoute = require("./routes/OverViewRoute");
const employeeAccessRoute = require("./routes/Rules&Permission/GetEmployeeAccessDataRoute");
const updateEmployeeAccessData = require("./routes/Rules&Permission/UpdateEmployeeAccessDataRoute");
const facilityRoute = require("./routes/GetAllFacilityRoute");
const getDepartmentList = require("./routes/DepartmentRoute/GetDepartmentListRoute");
const updateDepartmentRoute = require("./routes/DepartmentRoute/UpdateDepartmentListRoute");
const getDesignationRoute = require("./routes/DesignationRoute/GetDesignationListRoute");
const updateDesignationRoute = require("./routes/DesignationRoute/UpdateDesignationListRoute");
const searchEmployee = require("./routes/EmployeeProfileRoute/EmployeeSearchRoute");
const updateEmployeeRoute = require("./routes/EmployeeProfileRoute/EmployeeUpdateRoute")
const changePassword = require("./routes/HomePageRoutes/ChangePasswordRoute")



const getAttendanceReport = require("./routes/ReportsRoute/AttendanceReportRoute");
const getAbsentReport = require("./routes/ReportsRoute/AbsentReportRoute");
const getEmployeeList = require("./routes/ReportsRoute/EmployeeListRoute");
const getAccessFacility = require("./routes/ReportsRoute/AccessFacilityLoadRoute")









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
app.use("/api", overviewRoute);
app.use("/api", employeeAccessRoute);
app.use("/api", updateEmployeeAccessData);
app.use("/api", facilityRoute);
app.use("/api", getDepartmentList);
app.use("/api", updateDepartmentRoute);
app.use("/api", getDesignationRoute);
app.use("/api", updateDesignationRoute);
app.use("/api", searchEmployee);
app.use("/api", updateEmployeeRoute);
app.use("/api", changePassword);



app.use("/api", getAttendanceReport);
app.use("/api", getAbsentReport);
app.use("/api", getEmployeeList);
app.use("/api", getAccessFacility);





// Database connection
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection failed:", err));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

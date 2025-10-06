const { sql } = require("../../config/dbConfig");
const moment = require("moment");

const searchEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ message: "employeeId is required" });

    const pool = await sql.connect();
    const trimmedId = employeeId.trim();

    // 1️⃣ Get employee data
    const empResult = await pool.request()
      .input("employeeId", sql.NVarChar, trimmedId)
      .query(`
        SELECT *
        FROM [TA].[dbo].[Employee]
        WHERE LTRIM(RTRIM(EmployeeId)) = @employeeId
      `);
    const empData = empResult.recordset[0] || null;

    // 2️⃣ Get today's punch using BETWEEN startOfDay and endOfDay
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const punchResult = await pool.request()
      .input("EmployeeId", sql.NVarChar, trimmedId)
      .input("todayStart", sql.DateTime, todayStart)
      .input("todayEnd", sql.DateTime, todayEnd)
      .query(`
        SELECT TOP 1 devdt AS firstPunch
        FROM [TA].[dbo].[punchlog]
        WHERE LTRIM(RTRIM(user_id)) = @EmployeeId
          AND devdt BETWEEN @todayStart AND @todayEnd
        ORDER BY devdt ASC
      `);

    const firstPunchToday = punchResult.recordset[0]
      ? moment(punchResult.recordset[0].firstPunch).format("HH:mm")
      : "Not Punch Yet";

    // 3️⃣ Get last 7 days punches
    const last7DaysStart = moment().subtract(6, "days").startOf("day").toDate();
    const last7DaysEnd = moment().endOf("day").toDate();

    const last7DaysResult = await pool.request()
      .input("userId", sql.NVarChar, trimmedId)
      .input("startDate", sql.DateTime, last7DaysStart)
      .input("endDate", sql.DateTime, last7DaysEnd)
      .query(`
        SELECT CONVERT(date, devdt) AS punchDate,
               MIN(devdt) AS firstPunch,
               MAX(devdt) AS lastPunch
        FROM [TA].[dbo].[punchlog]
        WHERE LTRIM(RTRIM(user_id)) = @userId
          AND devdt BETWEEN @startDate AND @endDate
        GROUP BY CONVERT(date, devdt)
        ORDER BY punchDate DESC
      `);

    const last7DaysPunch = last7DaysResult.recordset.map(p => {
      const durationMs = new Date(p.lastPunch) - new Date(p.firstPunch);
      const duration = moment.utc(durationMs).format("H [hrs] m [mins]");
      return {
        date: moment(p.punchDate).format("YYYY-MM-DD"),
        firstPunch: p.firstPunch ? moment(p.firstPunch).format("HH:mm") : "N/A",
        lastPunch: p.lastPunch ? moment(p.lastPunch).format("HH:mm") : "N/A",
        duration,
      };
    });

    return res.json({
      message: "User found",
      data: empData || { EmployeeId: trimmedId },
      PunchInTime: firstPunchToday,
      TotalShiftHours: 8,
      last7DaysPunch,
    });

  } catch (err) {
    console.error("Error searching employee:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { searchEmployee };

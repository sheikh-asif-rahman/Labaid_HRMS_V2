const { sql } = require("../../config/dbConfig");
const moment = require("moment");

const todaysattendance = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }

    const today = moment().format("YYYY-MM-DD");


    const pool = await sql.connect();
    const result = await pool.request()
      .input("EmployeeId", sql.NVarChar, EmployeeId)
      .input("today", sql.Date, today)
      .query(`
        SELECT TOP 1 devdt AS firstPunch
        FROM [TA].[dbo].[punchlog]
        WHERE user_id = @EmployeeId
          AND CAST(devdt AS DATE) = @today
        ORDER BY devdt ASC
      `);


    const punch = result.recordset[0];
    const firstPunchTime = punch
      ? moment(punch.firstPunch).format("HH:mm")
      : "Not Punch Yet";


    return res.json({
      EmployeeId,
      date: moment().format("DD/MM/YYYY"),
      PunchInTime: firstPunchTime,
      TotalShiftHours: 8,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { todaysattendance };

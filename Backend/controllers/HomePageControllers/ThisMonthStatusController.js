const { sql } = require("../../config/dbConfig");
const moment = require("moment");

const thismonthstatus = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }

    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD"); // Only up to today

    // Connect to DB
    const pool = await sql.connect();
    const result = await pool.request()
      .input("EmployeeId", sql.NVarChar, EmployeeId)
      .input("startOfMonth", sql.Date, startOfMonth)
      .input("today", sql.Date, today)
      .query(`
        SELECT 
          CAST(devdt AS DATE) AS punchDate,
          MIN(devdt) AS firstIn,
          MAX(devdt) AS lastOut,
          COUNT(*) AS punchCount
        FROM [TA].[dbo].[punchlog]
        WHERE user_id = @EmployeeId
          AND CAST(devdt AS DATE) BETWEEN @startOfMonth AND @today
        GROUP BY CAST(devdt AS DATE)
        ORDER BY punchDate
      `);

    const punchData = result.recordset;

    // Generate all dates from start of month to today
    const daysInMonthSoFar = [];
    const current = moment(startOfMonth);
    const last = moment(today);
    while (current <= last) {
      daysInMonthSoFar.push(current.format("YYYY-MM-DD"));
      current.add(1, "day");
    }

    // Initialize counts
    let fullDay = 0;
    let halfDay = 0;
    let absent = 0;
    let leave = 0; // update if you track leaves separately

    daysInMonthSoFar.forEach((day) => {
      const punch = punchData.find(
        (p) => moment(p.punchDate).format("YYYY-MM-DD") === day
      );

      if (!punch) {
        absent++;
      } else {
        const inTime = moment(punch.firstIn);
        const outTime = moment(punch.lastOut);
        let duration = moment.duration(outTime.diff(inTime)).asHours();

        // Full day >=6 hours, Half day <6 hours
        if (duration >= 6) {
          fullDay++;
        } else if (duration > 0 && duration < 6) {
          halfDay++;
        } else {
          // If only 1 punch or zero duration
          halfDay++;
        }
      }
    });

    return res.json({
      EmployeeId,
      month: moment().format("MMMM"),
      fullDay,
      halfDay,
      absent,
      leave,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { thismonthstatus };

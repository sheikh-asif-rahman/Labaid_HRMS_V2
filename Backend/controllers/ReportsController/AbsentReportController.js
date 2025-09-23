const { sql } = require("../../config/dbConfig");

// helper: generate all dates between two dates
function generateDateRange(from, to) {
  const dates = [];
  let current = new Date(from);
  while (current <= to) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

const getAbsentReport = async (req, res) => {
  try {
    const { facilityId, userId, fromDate, toDate } = req.body;

    if (!facilityId || !fromDate || !toDate) {
      return res.status(400).json({ message: "facilityId, fromDate, and toDate are required" });
    }

    // 1. Get employees
    let employeeQuery = `
      SELECT EmployeeId, EmployeeName, DepartmentId, DesignationId, BranchId
      FROM [TA].[dbo].[Employee]
      WHERE BranchId = @facilityId
    `;
    if (userId) {
      employeeQuery += " AND EmployeeId = @userId";
    }

    const empRequest = new sql.Request();
    empRequest.input("facilityId", sql.NVarChar, facilityId);
    if (userId) empRequest.input("userId", sql.NVarChar, userId);

    const employeeResult = await empRequest.query(employeeQuery);

    if (userId && employeeResult.recordset.length === 0) {
      return res.status(404).json({ message: "User not found in this facility" });
    }

    if (employeeResult.recordset.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    const employeeIds = employeeResult.recordset.map(emp => emp.EmployeeId);

    // 2. Get punch dates
    let punchQuery = `
      SELECT user_id AS EmployeeId,
             CONVERT(DATE, devdt) AS PunchDate
      FROM [TA].[dbo].[punchlog]
      WHERE user_id IN (${employeeIds.map((_, i) => `@emp${i}`).join(",")})
        AND devdt BETWEEN @fromDate AND @toDate
      GROUP BY user_id, CONVERT(DATE, devdt)
    `;

    const punchRequest = new sql.Request();
    employeeIds.forEach((id, i) => punchRequest.input(`emp${i}`, sql.NVarChar, id));
    punchRequest.input("fromDate", sql.DateTime, fromDate);
    punchRequest.input("toDate", sql.DateTime, toDate);

    const punchResult = await punchRequest.query(punchQuery);

    // make map of punches
    const punchMap = {};
    punchResult.recordset.forEach(p => {
      const key = `${p.EmployeeId}_${p.PunchDate.toISOString().split("T")[0]}`;
      punchMap[key] = true;
    });

    // 3. Generate full absent report
    const allDates = generateDateRange(new Date(fromDate), new Date(toDate));
    const finalData = employeeResult.recordset.map(emp => {
      const absentDays = allDates
        .filter(d => !punchMap[`${emp.EmployeeId}_${d.toISOString().split("T")[0]}`])
        .map(d => ({
          Date: d.toISOString().split("T")[0],
          Status: "Absent"
        }));

      return {
        ...emp,
        AbsentDays: absentDays
      };
    });

    return res.json(finalData);

  } catch (error) {
    console.error("Error fetching absent report:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { getAbsentReport };

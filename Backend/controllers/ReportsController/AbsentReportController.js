const { sql } = require("../../config/dbConfig");

// helper: generate all dates between two dates
function generateDateRange(from, to) {
  const dates = [];
  let current = new Date(from);
  const end = new Date(to);
  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// ✅ format date as local YYYY-MM-DD (no UTC conversion)
function formatDateLocal(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// map JS getDay() to abbreviations
const weekdayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const getAbsentReport = async (req, res) => {
  try {
    const { facilityId, userId, fromDate, toDate } = req.body;
    if (!facilityId || !fromDate || !toDate) {
      return res.status(400).json({ message: "facilityId, fromDate, and toDate are required" });
    }

    // 1. Get employees with names and ShiftSchedule
    let employeeQuery = `
      SELECT 
        e.EmployeeId, 
        e.EmployeeName, 
        d.DepartmentName, 
        dg.DesignationName, 
        b.name AS BranchName,
        e.ShiftSchedule
      FROM [TA].[dbo].[Employee] e
      LEFT JOIN [TA].[dbo].[Department] d ON e.DepartmentId = d.DepartmentId
      LEFT JOIN [TA].[dbo].[Designation] dg ON e.DesignationId = dg.DesignationId
      LEFT JOIN [TA].[dbo].[Device] b ON e.BranchId = b.id
      WHERE e.BranchId = @facilityId
    `;
    if (userId) employeeQuery += " AND e.EmployeeId = @userId";

    const empRequest = new sql.Request();
    empRequest.input("facilityId", sql.NVarChar, facilityId);
    if (userId) empRequest.input("userId", sql.NVarChar, userId);

    const employeeResult = await empRequest.query(employeeQuery);
    if (employeeResult.recordset.length === 0)
      return res.status(404).json({ message: "No employees found" });

    const employeeIds = employeeResult.recordset.map(emp => emp.EmployeeId);

    // 2. Get punches
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
      const dateKey = formatDateLocal(p.PunchDate);
      punchMap[`${p.EmployeeId}_${dateKey}`] = true;
    });

    const allDates = generateDateRange(new Date(fromDate), new Date(toDate));

    const finalData = employeeResult.recordset.map(emp => {
      // Parse ShiftSchedule robustly
      const shiftMap = {};
      if (emp.ShiftSchedule && typeof emp.ShiftSchedule === "string") {
        emp.ShiftSchedule.split(",").forEach(entry => {
          const cleaned = entry.replace(/\s/g, '').toUpperCase();
          const match = cleaned.match(/([A-Z]{3})\[(FULLDAY|HALFDAY|OFFDAY)\]/);
          if (match) shiftMap[match[1]] = match[2];
        });
      }

      const absentDays = allDates
        .filter(d => {
          const dayAbbr = weekdayMap[d.getDay()];
          const schedule = shiftMap[dayAbbr];
          if (!schedule) return false;
          if (schedule === "OFFDAY" || schedule === "HALFDAY") return false;

          const punchKey = `${emp.EmployeeId}_${formatDateLocal(d)}`;
          return !punchMap[punchKey];
        })
        .map(d => ({ Date: formatDateLocal(d), Status: "Absent" }));

      return {
        EmployeeId: emp.EmployeeId,
        EmployeeName: emp.EmployeeName,
        DepartmentName: emp.DepartmentName || null,
        DesignationName: emp.DesignationName || null,
        BranchName: emp.BranchName || null,
        AbsentDays: absentDays,
      };
    });

    return res.json(finalData);
  } catch (error) {
    console.error("Error fetching absent report:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { getAbsentReport };

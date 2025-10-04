const { sql } = require("../../config/dbConfig");

// helper: format time in AM/PM
function formatTime(date) {
  if (!date) return null;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

// helper: calculate duration
function formatDuration(inTime, outTime) {
  if (!inTime || !outTime) return null;
  let diffMs = outTime - inTime; // difference in ms
  if (diffMs < 0) return null;

  let sec = Math.floor(diffMs / 1000);
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec = sec % 60;

  let parts = [];
  if (hrs > 0) parts.push(`${hrs} hour${hrs > 1 ? "s" : ""}`);
  if (mins > 0) parts.push(`${mins} min${mins > 1 ? "s" : ""}`);
  if (sec > 0) parts.push(`${sec} sec${sec > 1 ? "s" : ""}`);

  return parts.join(", ") || "0 sec";
}

const getAttendanceReport = async (req, res) => {
  try {
    const { facilityId, userId, fromDate, toDate } = req.body;

    if (!facilityId || !fromDate || !toDate) {
      return res.status(400).json({
        message: "facilityId, fromDate, and toDate are required",
      });
    }

    // 1. Get employees with DepartmentName, DesignationName, BranchName
    let employeeQuery = `
      SELECT 
        e.EmployeeId, 
        e.EmployeeName, 
        d.DepartmentName, 
        dg.DesignationName, 
        b.name AS BranchName
      FROM [TA].[dbo].[Employee] e
      LEFT JOIN [TA].[dbo].[Department] d ON e.DepartmentId = d.DepartmentId
      LEFT JOIN [TA].[dbo].[Designation] dg ON e.DesignationId = dg.DesignationId
      LEFT JOIN [TA].[dbo].[Device] b ON e.BranchId = b.id
      WHERE e.BranchId = @facilityId
    `;
    if (userId) {
      employeeQuery += " AND e.EmployeeId = @userId";
    }

    const empRequest = new sql.Request();
    empRequest.input("facilityId", sql.NVarChar, facilityId);
    if (userId) empRequest.input("userId", sql.NVarChar, userId);

    const employeeResult = await empRequest.query(employeeQuery);

    if (userId && employeeResult.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found in this facility" });
    }

    if (employeeResult.recordset.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    const employeeIds = employeeResult.recordset.map((emp) => emp.EmployeeId);

    // 2. Get punch data
    let punchQuery = `
      SELECT 
        user_id AS EmployeeId,
        CONVERT(DATE, devdt) AS PunchDate,
        MIN(devdt) AS InTime,
        MAX(devdt) AS OutTime
      FROM [TA].[dbo].[punchlog]
      WHERE user_id IN (${employeeIds.map((_, i) => `@emp${i}`).join(",")})
        AND devdt >= @fromDate
        AND devdt < DATEADD(DAY, 1, @toDate)
      GROUP BY user_id, CONVERT(DATE, devdt)
      ORDER BY user_id, PunchDate
    `;

    const punchRequest = new sql.Request();
    employeeIds.forEach((id, i) => punchRequest.input(`emp${i}`, sql.NVarChar, id));
    punchRequest.input("fromDate", sql.DateTime, fromDate);
    punchRequest.input("toDate", sql.DateTime, toDate);

    const punchResult = await punchRequest.query(punchQuery);

    // 3. Merge employee + punches
    const finalData = employeeResult.recordset.map((emp) => {
      const punches = punchResult.recordset.filter(
        (p) => p.EmployeeId === emp.EmployeeId
      );
      return {
        EmployeeId: emp.EmployeeId,
        EmployeeName: emp.EmployeeName,
        DepartmentName: emp.DepartmentName || null,
        DesignationName: emp.DesignationName || null,
        BranchName: emp.BranchName || null,
        Attendance: punches.map((p) => {
          if (!p.OutTime || p.InTime.getTime() === p.OutTime.getTime()) {
            return {
              Date: p.PunchDate,
              In: formatTime(p.InTime),
              Out: "N/A", // <-- Show N/A if no out time
              Duration: null,
            };
          }
          return {
            Date: p.PunchDate,
            In: formatTime(p.InTime),
            Out: formatTime(p.OutTime),
            Duration: formatDuration(p.InTime, p.OutTime),
          };
        }),
      };
    });

    return res.json(finalData);
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { getAttendanceReport };

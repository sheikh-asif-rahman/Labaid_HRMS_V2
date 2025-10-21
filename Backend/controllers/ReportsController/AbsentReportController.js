const { sql } = require("../../config/dbConfig");

// helper: generate all dates between two dates (inclusive)
function generateDateRange(from, to) {
  const dates = [];
  const current = new Date(from);
  const end = new Date(to);
  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// format date as local YYYY-MM-DD (no UTC conversion)
function formatDateLocal(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const weekdayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const getAbsentReport = async (req, res) => {
  try {
    const { facilityId, userId, fromDate, toDate } = req.body;
    if (!facilityId || !fromDate || !toDate) {
      return res.status(400).json({
        message: "facilityId, fromDate, and toDate are required",
      });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (isNaN(start.valueOf()) || isNaN(end.valueOf())) {
      return res.status(400).json({ message: "Invalid fromDate or toDate" });
    }

    // 1️⃣ Fetch employees for the facility (or single user if provided)
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
    if (userId) employeeQuery += ` AND e.EmployeeId = @userId`;

    const empRequest = new sql.Request();
    empRequest.input("facilityId", sql.NVarChar, facilityId);
    if (userId) empRequest.input("userId", sql.NVarChar, userId);
    const employeeResult = await empRequest.query(employeeQuery);
    const employees = employeeResult.recordset || [];
    if (employees.length === 0)
      return res.status(404).json({ message: "No employees found" });

    // 2️⃣ Fetch punch logs for the given range
    const fromDateInclusive = new Date(start);
    fromDateInclusive.setHours(0, 0, 0, 0);
    const toDateExclusive = new Date(end);
    toDateExclusive.setDate(toDateExclusive.getDate() + 1);
    toDateExclusive.setHours(0, 0, 0, 0);

    const punchQuery = `
      SELECT DISTINCT
        pl.user_id AS EmployeeId,
        CONVERT(date, pl.devdt) AS PunchDate
      FROM [TA].[dbo].[punchlog] pl
      INNER JOIN (
        SELECT EmployeeId FROM [TA].[dbo].[Employee] WHERE BranchId = @facilityId
        ${userId ? "AND EmployeeId = @userId" : ""}
      ) e ON LTRIM(RTRIM(pl.user_id)) = LTRIM(RTRIM(e.EmployeeId))
      WHERE pl.devdt >= @fromDateInclusive
        AND pl.devdt < @toDateExclusive
    `;

    const punchRequest = new sql.Request();
    punchRequest.input("facilityId", sql.NVarChar, facilityId);
    if (userId) punchRequest.input("userId", sql.NVarChar, userId);
    punchRequest.input("fromDateInclusive", sql.DateTime, fromDateInclusive);
    punchRequest.input("toDateExclusive", sql.DateTime, toDateExclusive);

    const punchResult = await punchRequest.query(punchQuery);
    const punches = punchResult.recordset || [];

    const punchMap = {};
    punches.forEach((p) => {
      const dateKey = formatDateLocal(p.PunchDate);
      const empKey = String(p.EmployeeId).trim();
      punchMap[`${empKey}_${dateKey}`] = true;
    });

    // 3️⃣ Fetch leave data for those employees in the date range
    const leaveQuery = `
      SELECT 
        EmployeeId,
        [From Date] AS FromDate,
        [To Date] AS ToDate
      FROM [TA].[dbo].[leave]
      WHERE [From Date] <= @toDate
        AND [To Date] >= @fromDate
    `;

    const leaveRequest = new sql.Request();
    leaveRequest.input("fromDate", sql.Date, fromDateInclusive);
    leaveRequest.input("toDate", sql.Date, end);
    const leaveResult = await leaveRequest.query(leaveQuery);
    const leaves = leaveResult.recordset || [];

    // build map of leave ranges per employee
    const leaveMap = {};
    leaves.forEach((l) => {
      const empId = String(l.EmployeeId).trim();
      if (!leaveMap[empId]) leaveMap[empId] = [];
      leaveMap[empId].push({
        from: new Date(l.FromDate),
        to: new Date(l.ToDate),
      });
    });

    // 4️⃣ Generate full date range
    const allDates = generateDateRange(fromDateInclusive, new Date(end));

    // 5️⃣ Calculate absences excluding leaves
    const finalData = employees.map((emp) => {
      const shiftMap = {};
      if (emp.ShiftSchedule && typeof emp.ShiftSchedule === "string") {
        emp.ShiftSchedule.split(",").forEach((entry) => {
          const cleaned = entry.replace(/\s/g, "").toUpperCase();
          const match = cleaned.match(/([A-Z]{3})\[(FULLDAY|HALFDAY|OFFDAY)\]/);
          if (match) shiftMap[match[1]] = match[2];
        });
      }
      if (Object.keys(shiftMap).length === 0) {
        weekdayMap.forEach((abbr) => (shiftMap[abbr] = "FULLDAY"));
      }

      const absentDays = allDates
        .filter((d) => {
          const dayAbbr = weekdayMap[d.getDay()];
          const schedule = shiftMap[dayAbbr];
          if (!schedule || schedule === "OFFDAY" || schedule === "HALFDAY")
            return false;

          const dateStr = formatDateLocal(d);
          const empKey = `${String(emp.EmployeeId).trim()}_${dateStr}`;

          // 👇 skip if punched
          if (punchMap[empKey]) return false;

          // 👇 skip if on leave
          const empLeaves = leaveMap[String(emp.EmployeeId).trim()] || [];
          const onLeave = empLeaves.some(
            (l) => d >= l.from && d <= l.to
          );
          if (onLeave) return false;

          return true; // count as absent
        })
        .map((d) => ({ Date: formatDateLocal(d), Status: "Absent" }));

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
    return res
      .status(500)
      .json({ message: "Internal server error", error: String(error) });
  }
};

module.exports = { getAbsentReport };

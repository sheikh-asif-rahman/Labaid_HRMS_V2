const { sql } = require("../../config/dbConfig");
const moment = require("moment"); // for easier date formatting

const searchEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    // 1. Search in Employee table
    const empRequest = new sql.Request();
    empRequest.input("employeeId", sql.NVarChar, employeeId);

    const empResult = await empRequest.query(`
      SELECT 
        [EmployeeName],
        [EmployeeId],
        [DepartmentId],
        [DesignationId],
        [BranchId],
        [DateOfJoin],
        [DateOfResign],
        [NID],
        [PersonalContactNumber],
        [OfficalContactNumber],
        [Email],
        [EmployeeType],
        [Gender],
        [MaritalStatus],
        [BloodGroup],
        [FatherName],
        [MotherName],
        [PresentAddress],
        [PermanentAddress],
        [Image],
        [Password],
        [ShiftSchedule]
      FROM [TA].[dbo].[Employee]
      WHERE EmployeeId = @employeeId
    `);

    let empData = null;

    if (empResult.recordset.length > 0) {
      empData = empResult.recordset[0];
      // mask password
      empData.Password = "********";
    }

    // 2. If not found in Employee table, search in Punchlog table
    const punchRequest = new sql.Request();
    punchRequest.input("employeeId", sql.NVarChar, employeeId);

    const punchResult = await punchRequest.query(`
      SELECT TOP 1 user_id 
      FROM [TA].[dbo].[punchlog]
      WHERE user_id = @employeeId
    `);

    if (!empData && punchResult.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use employeeId from punchlog if not found in Employee table
    const userId = empData ? empData.EmployeeId : punchResult.recordset[0].user_id;

    // 3. Get today's first punch time
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    const todayPunchRequest = new sql.Request();
    todayPunchRequest.input("userId", sql.NVarChar, userId);
    todayPunchRequest.input("todayStart", sql.DateTime, todayStart);
    todayPunchRequest.input("todayEnd", sql.DateTime, todayEnd);

    const todayPunchResult = await todayPunchRequest.query(`
      SELECT TOP 1 devdt
      FROM [TA].[dbo].[punchlog]
      WHERE user_id = @userId
        AND devdt BETWEEN @todayStart AND @todayEnd
      ORDER BY devdt ASC
    `);

    const firstPunchToday = todayPunchResult.recordset.length > 0 
      ? moment(todayPunchResult.recordset[0].devdt).format('HH:mm A') 
      : null;

    // 4. Get last 7 days punch data with duration per day
    const last7DaysStart = moment().subtract(6, 'days').startOf('day').toDate(); // 7 days including today

    const last7DaysRequest = new sql.Request();
    last7DaysRequest.input("userId", sql.NVarChar, userId);
    last7DaysRequest.input("startDate", sql.DateTime, last7DaysStart);
    last7DaysRequest.input("endDate", sql.DateTime, todayEnd);

    const last7DaysResult = await last7DaysRequest.query(`
      SELECT CONVERT(date, devdt) AS punchDate,
             MIN(devdt) AS firstPunch,
             MAX(devdt) AS lastPunch
      FROM [TA].[dbo].[punchlog]
      WHERE user_id = @userId
        AND devdt BETWEEN @startDate AND @endDate
      GROUP BY CONVERT(date, devdt)
      ORDER BY punchDate DESC
    `);

    const last7DaysData = last7DaysResult.recordset.map(p => {
      const durationMs = new Date(p.lastPunch) - new Date(p.firstPunch);
      const duration = moment.utc(durationMs).format('H [hrs] m [mins] s [secs]');
      return {
        date: moment(p.punchDate).format('YYYY-MM-DD'),
        firstPunch: moment(p.firstPunch).format('HH:mm A'),
        lastPunch: moment(p.lastPunch).format('HH:mm A'),
        duration
      };
    });

    // 5. Return the response
    return res.json({
      message: "User found",
      data: empData || { EmployeeId: userId },
      firstPunchToday,
      last7DaysPunch: last7DaysData
    });

  } catch (error) {
    console.error("Error searching employee:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { searchEmployee };

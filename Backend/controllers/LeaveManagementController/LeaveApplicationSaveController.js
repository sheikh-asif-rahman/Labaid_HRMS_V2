const { sql } = require("../../config/dbConfig");

const saveLeaveApplication = async (req, res) => {
  try {
    const {
      EmployeeId,
      Purpose,
      TotalLeave,
      FromDate,
      ToDate,
      AlternativePerson,
    } = req.body;

    // ✅ Validate required fields
    if (!EmployeeId || !Purpose || !TotalLeave || !FromDate || !ToDate) {
      return res.status(400).json({
        success: false,
        message: "EmployeeId, Purpose, TotalLeave, FromDate, and ToDate are required",
      });
    }

    const ApplicationDate = new Date().toISOString(); // current timestamp

    const query = `
      INSERT INTO [TA].[dbo].[leave]
        ([EmployeeId], [ApplicationDate], [Purpose], [Total Leave], [From Date], [To Date], [Alternative Person])
      VALUES
        (@EmployeeId, @ApplicationDate, @Purpose, @TotalLeave, @FromDate, @ToDate, @AlternativePerson)
    `;

    const request = new sql.Request();
    request.input("EmployeeId", sql.NVarChar, EmployeeId);
    request.input("ApplicationDate", sql.DateTime, ApplicationDate);
    request.input("Purpose", sql.NVarChar, Purpose);
    request.input("TotalLeave", sql.Int, TotalLeave);
    request.input("FromDate", sql.DateTime, FromDate);
    request.input("ToDate", sql.DateTime, ToDate);
    request.input("AlternativePerson", sql.NVarChar, AlternativePerson || null);

    await request.query(query);

    res.status(200).json({
      success: true,
      message: "Leave application submitted successfully ✅",
    });
  } catch (error) {
    console.error("Error saving leave application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit leave application ❌",
    });
  }
};

module.exports = { saveLeaveApplication };

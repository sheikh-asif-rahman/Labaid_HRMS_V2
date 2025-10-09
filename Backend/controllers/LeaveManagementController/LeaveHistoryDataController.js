const { sql } = require("../../config/dbConfig");

const getLeaveHistory = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({
        success: false,
        message: "EmployeeId is required",
      });
    }

    const query = `
      SELECT 
        [EmployeeId],
        [ApplicationDate],
        [Purpose],
        [Total Leave] AS TotalLeave,
        [From Date] AS FromDate,
        [To Date] AS ToDate,
        [Alternative Person] AS AlternativePerson,
        [Status]
      FROM [TA].[dbo].[leave]
      WHERE [EmployeeId] = @EmployeeId
      ORDER BY [ApplicationDate] DESC
    `;

    const request = new sql.Request();
    request.input("EmployeeId", sql.NVarChar, EmployeeId); // assuming EmployeeId is NVARCHAR
    const result = await request.query(query);

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave history",
    });
  }
};

module.exports = { getLeaveHistory };

const { sql } = require("../../config/dbConfig");

const usershortprofile = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }

    // Connect to DB
    const pool = await sql.connect();
    const result = await pool.request()
      .input("EmployeeId", sql.NVarChar, EmployeeId)
      .query(`
        SELECT 
          EmployeeName,
          EmployeeId,
          DepartmentId,
          DesignationId,
          BranchId
        FROM [TA].[dbo].[Employee]
        WHERE EmployeeId = @EmployeeId
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Add default values for fields not ready yet
    user.Shift = "morning";
    user.LeaveBalance = 20;

    return res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { usershortprofile };

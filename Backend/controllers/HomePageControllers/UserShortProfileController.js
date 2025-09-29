const { sql } = require("../../config/dbConfig");

const usershortprofile = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }

    // Connect to DB
    const pool = await sql.connect();

    // Get employee info
    const empResult = await pool.request()
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

    const user = empResult.recordset[0];

    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch Department Name
    let departmentName = null;
    if (user.DepartmentId) {
      const depResult = await pool.request()
        .input("DepartmentId", sql.Int, user.DepartmentId)
        .query(`SELECT DepartmentName FROM [TA].[dbo].[Department] WHERE DepartmentId = @DepartmentId`);
      departmentName = depResult.recordset[0]?.DepartmentName || null;
    }

    // Fetch Designation Name
    let designationName = null;
    if (user.DesignationId) {
      const desResult = await pool.request()
        .input("DesignationId", sql.Int, user.DesignationId)
        .query(`SELECT DesignationName FROM [TA].[dbo].[Designation] WHERE DesignationId = @DesignationId`);
      designationName = desResult.recordset[0]?.DesignationName || null;
    }

    // Fetch Branch Name
    let branchName = null;
    if (user.BranchId) {
      const branchResult = await pool.request()
        .input("BranchId", sql.NVarChar, user.BranchId)
        .query(`SELECT name FROM [TA].[dbo].[Device] WHERE id = @BranchId`);
      branchName = branchResult.recordset[0]?.name || null;
    }

    // Build final response
    const response = {
      EmployeeName: user.EmployeeName,
      EmployeeId: user.EmployeeId,
      DepartmentName: departmentName,
      DesignationName: designationName,
      BranchName: branchName,
      Shift: "morning",         // default
      LeaveBalance: 20          // default
    };

    return res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { usershortprofile };

const { sql } = require("../../config/dbConfig");

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

    if (empResult.recordset.length > 0) {
      const emp = empResult.recordset[0];
      // mask password
      emp.Password = "********";

      return res.json({
        message: "User found in Employee table",
        data: emp
      });
    }

    // 2. If not found, search in Punchlog
    const punchRequest = new sql.Request();
    punchRequest.input("employeeId", sql.NVarChar, employeeId);

    const punchResult = await punchRequest.query(`
      SELECT TOP 1 user_id 
      FROM [TA].[dbo].[punchlog]
      WHERE user_id = @employeeId
    `);

    if (punchResult.recordset.length > 0) {
      return res.json({
        message: "User found in Punchlog table",
        data: { user_id: punchResult.recordset[0].user_id }
      });
    }

    // 3. If not found anywhere
    return res.status(404).json({ message: "User not found" });

  } catch (error) {
    console.error("Error searching employee:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { searchEmployee };

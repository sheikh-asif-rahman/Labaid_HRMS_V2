const { sql } = require("../../config/dbConfig");

// Controller: Get Employee Access Data
const getEmployeeAccessData = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ error: "EmployeeId is required" });
    }

    const result = await sql.query`
      SELECT EmployeeId, EmployeeName, Permission, AccessToBranchId
      FROM [TA].[dbo].[Employee]
      WHERE EmployeeId = ${employeeId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(result.recordset[0]); 
    } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getEmployeeAccessData };

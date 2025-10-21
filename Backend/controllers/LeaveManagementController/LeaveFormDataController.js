const { sql } = require("../../config/dbConfig");

const getLeaveFormData = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({
        success: false,
        message: "EmployeeId is required",
      });
    }

    // 1. Fetch employee info
    const employeeQuery = `
      SELECT 
        e.EmployeeId, 
        e.EmployeeName, 
        e.DepartmentId, 
        e.DesignationId, 
        e.BranchId, 
        e.DateOfJoin
      FROM [TA].[dbo].[Employee] e
      WHERE e.EmployeeId = '${EmployeeId}'
    `;
    const employeeResult = await sql.query(employeeQuery);

    if (employeeResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employee = employeeResult.recordset[0];

    // 2. Fetch Branch, Designation & Department Names
    const branchQuery = `
      SELECT name AS BranchName 
      FROM [dbo].[device] 
      WHERE id = '${employee.BranchId}'
    `;
    const designationQuery = `
      SELECT DesignationName 
      FROM [TA].[dbo].[Designation] 
      WHERE DesignationId = '${employee.DesignationId}'
    `;
    const departmentQuery = `
      SELECT DepartmentName 
      FROM [TA].[dbo].[Department] 
      WHERE DepartmentId = '${employee.DepartmentId}'
    `;

    const [branchResult, designationResult, departmentResult] = await Promise.all([
      sql.query(branchQuery),
      sql.query(designationQuery),
      sql.query(departmentQuery),
    ]);

    const BranchName = branchResult.recordset[0]?.BranchName || null;
    const DesignationName = designationResult.recordset[0]?.DesignationName || null;
    const DepartmentName = departmentResult.recordset[0]?.DepartmentName || null;

    // 3. Fetch Leave Data (Current Year) – All leaves
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    const leaveQuery = `
      SELECT [ApplicationId], [ApplicationDate], [Purpose], [Total Leave], [From Date], [To Date], [Alternative Person]
      FROM [TA].[dbo].[leave]
      WHERE EmployeeId = '${EmployeeId}'
        AND [ApplicationDate] BETWEEN '${startDate}' AND '${endDate}'
      ORDER BY [ApplicationDate] DESC
    `;
    const leaveResult = await sql.query(leaveQuery);

    // 4. Calculate Leave Enjoyed & Balance
    const totalLeavesTaken = leaveResult.recordset.reduce(
      (sum, row) => sum + (parseInt(row["Total Leave"]) || 0),
      0
    );

    const totalAllowed = 20; // Example: 20 days/year
    const leaveBalance = Math.max(totalAllowed - totalLeavesTaken, 0);

    // 5. Combine & Send Response
    res.status(200).json({
      success: true,
      data: {
        EmployeeId: employee.EmployeeId,
        EmployeeName: employee.EmployeeName,
        DepartmentName,
        DesignationName,
        BranchName,
        DateOfJoin: employee.DateOfJoin,
        LeaveEnjoyed: totalLeavesTaken,
        LeaveBalance: leaveBalance,
        Leaves: leaveResult.recordset, // send full leave list
      },
    });
  } catch (error) {
    console.error("Error fetching Leave Form Data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave form data",
    });
  }
};

module.exports = { getLeaveFormData };

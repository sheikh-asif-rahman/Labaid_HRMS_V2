const { sql } = require("../../config/dbConfig");

const getLeaveApproveRejectData = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({
        success: false,
        message: "EmployeeId is required in body",
      });
    }

    // 1️⃣ Get user's branch access permissions
    const accessQuery = `
      SELECT [AccessToBranchId]
      FROM [TA].[dbo].[Employee]
      WHERE [EmployeeId] = '${EmployeeId}'
    `;
    const accessResult = await sql.query(accessQuery);

    if (accessResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or access info missing",
      });
    }

    const accessData = accessResult.recordset[0].AccessToBranchId;
    if (!accessData) {
      return res.status(403).json({
        success: false,
        message: "This employee does not have access to any branches",
      });
    }

    // Parse AccessToBranchId list into array
    const accessibleBranches = accessData.split(",").map((id) => id.trim());

    // Convert to SQL-safe IN clause string
    const branchList = accessibleBranches.map((id) => `'${id}'`).join(",");

    // 2️⃣ Fetch all leave applications filtered by accessible branches
    const leaveQuery = `
      SELECT 
        L.[EmployeeId],
        L.[ApplicationDate],
        L.[Purpose],
        L.[Total Leave] AS TotalLeave,
        L.[From Date] AS FromDate,
        L.[To Date] AS ToDate,
        L.[Alternative Person] AS AlternativePerson,
        L.[Status]
      FROM [TA].[dbo].[leave] L
      INNER JOIN [TA].[dbo].[Employee] E ON L.[EmployeeId] = E.[EmployeeId]
      WHERE E.[BranchId] IN (${branchList})
      ORDER BY L.[ApplicationDate] DESC
    `;
    const leaveResult = await sql.query(leaveQuery);

    if (leaveResult.recordset.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No leave records found for accessible branches",
      });
    }

    const leaves = leaveResult.recordset;

    // 3️⃣ Enrich each record
    const enrichedData = await Promise.all(
      leaves.map(async (leave) => {
        // Employee info
        const empQuery = `
          SELECT 
            EmployeeName, 
            DepartmentId, 
            DesignationId, 
            BranchId
          FROM [TA].[dbo].[Employee]
          WHERE EmployeeId = '${leave.EmployeeId}'
        `;
        const empResult = await sql.query(empQuery);
        const employee = empResult.recordset[0];

        if (!employee) {
          return {
            ...leave,
            EmployeeName: null,
            DepartmentName: null,
            DesignationName: null,
            BranchName: null,
          };
        }

        // Name lookups (parallel)
        const [branchRes, deptRes, desigRes] = await Promise.all([
          sql.query(
            `SELECT name AS BranchName FROM [TA].[dbo].[device] WHERE id = '${employee.BranchId}'`
          ),
          sql.query(
            `SELECT DepartmentName FROM [TA].[dbo].[Department] WHERE DepartmentId = '${employee.DepartmentId}'`
          ),
          sql.query(
            `SELECT DesignationName FROM [TA].[dbo].[Designation] WHERE DesignationId = '${employee.DesignationId}'`
          ),
        ]);

        const BranchName = branchRes.recordset[0]?.BranchName || null;
        const DepartmentName = deptRes.recordset[0]?.DepartmentName || null;
        const DesignationName = desigRes.recordset[0]?.DesignationName || null;

        return {
          EmployeeId: leave.EmployeeId,
          EmployeeName: employee.EmployeeName,
          DepartmentName,
          DesignationName,
          BranchName,
          ApplicationDate: leave.ApplicationDate,
          Purpose: leave.Purpose,
          TotalLeave: leave.TotalLeave,
          FromDate: leave.FromDate,
          ToDate: leave.ToDate,
          AlternativePerson: leave.AlternativePerson,
          Status: leave.Status,
        };
      })
    );

    // ✅ Final Response
    res.status(200).json({
      success: true,
      count: enrichedData.length,
      data: enrichedData,
    });
  } catch (error) {
    console.error("Error fetching Leave Approve/Reject Data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave approve/reject data",
    });
  }
};

module.exports = { getLeaveApproveRejectData };

const { sql } = require("../../config/dbConfig");

// Get Employee List by FacilityId (BranchId)
const getEmployeeList = async (req, res) => {
  try {
    const { facilityId } = req.body;

    if (!facilityId) {
      return res.status(400).json({ message: "facilityId is required in request body" });
    }

    const query = `
      SELECT 
        e.EmployeeName,
        e.EmployeeId,
        d.DepartmentName AS Department,
        des.DesignationName AS Designation,
        b.name AS Branch,
        e.DateOfJoin,
        e.DateOfResign,
        e.NID,
        e.PersonalContactNumber,
        e.OfficalContactNumber,
        e.Email,
        e.EmployeeType,
        e.Gender,
        e.MaritalStatus,
        e.BloodGroup,
        e.FatherName,
        e.MotherName,
        e.PresentAddress,
        e.PermanentAddress,
        e.ShiftSchedule
      FROM [TA].[dbo].[Employee] e
      LEFT JOIN [TA].[dbo].[Department] d
        ON e.DepartmentId = d.DepartmentID
      LEFT JOIN [TA].[dbo].[Designation] des
        ON e.DesignationId = des.DesignationID
      LEFT JOIN [TA].[dbo].[device] b
        ON e.BranchId = b.id
      WHERE e.BranchId = @facilityId
    `;

    const request = new sql.Request();
    request.input("facilityId", sql.NVarChar, facilityId);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No employees found for this facilityId" });
    }

    return res.json(result.recordset);

  } catch (error) {
    console.error("Error fetching employee list:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { getEmployeeList };

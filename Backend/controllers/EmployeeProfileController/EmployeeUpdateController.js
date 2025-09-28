const { sql } = require("../../config/dbConfig");
const moment = require("moment");

const updateEmployee = async (req, res) => {
  try {
    const data = req.body;

    if (!data.EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }
    if (!data.type || !["profile", "shift"].includes(data.type)) {
      return res.status(400).json({ message: "type must be 'profile' or 'shift'" });
    }

    // 1. Fetch existing employee
    const empRequest = new sql.Request();
    empRequest.input("EmployeeId", sql.NVarChar, data.EmployeeId);
    const empResult = await empRequest.query(`
      SELECT *
      FROM [TA].[dbo].[Employee]
      WHERE EmployeeId = @EmployeeId
    `);

    if (empResult.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee = empResult.recordset[0];
    const now = moment().toDate();

    // Common fields
    const updatedBy = data.UserId || "SYSTEM";
    const updatedDate = now;

    if (data.type === "profile") {
      // Update profile fields
      const updateRequest = new sql.Request();
      updateRequest.input("EmployeeId", sql.NVarChar, data.EmployeeId);
      updateRequest.input("EmployeeName", sql.NVarChar, data.EmployeeName);
      updateRequest.input("DepartmentId", sql.NVarChar, data.DepartmentId);
      updateRequest.input("DesignationId", sql.NVarChar, data.DesignationId);
      updateRequest.input("BranchId", sql.NVarChar, data.BranchId);
      updateRequest.input("DateOfJoin", sql.Date, data.DateOfJoin);
      updateRequest.input("DateOfResign", sql.Date, data.DateOfResign);
      updateRequest.input("NID", sql.NVarChar, data.NID);
      updateRequest.input("PersonalContactNumber", sql.NVarChar, data.PersonalContactNumber);
      updateRequest.input("OfficalContactNumber", sql.NVarChar, data.OfficalContactNumber);
      updateRequest.input("Email", sql.NVarChar, data.Email);
      updateRequest.input("EmployeeType", sql.NVarChar, data.EmployeeType);
      updateRequest.input("Gender", sql.NVarChar, data.Gender);
      updateRequest.input("MaritalStatus", sql.NVarChar, data.MaritalStatus);
      updateRequest.input("BloodGroup", sql.NVarChar, data.BloodGroup);
      updateRequest.input("FatherName", sql.NVarChar, data.FatherName);
      updateRequest.input("MotherName", sql.NVarChar, data.MotherName);
      updateRequest.input("PresentAddress", sql.NVarChar, data.PresentAddress);
      updateRequest.input("PermanentAddress", sql.NVarChar, data.PermanentAddress);
      updateRequest.input("Status", sql.NVarChar, data.Status);
      updateRequest.input("UpdatedBy", sql.NVarChar, updatedBy);
      updateRequest.input("UpdatedDate", sql.DateTime, updatedDate);

      await updateRequest.query(`
        UPDATE [TA].[dbo].[Employee]
        SET 
          EmployeeName = @EmployeeName,
          DepartmentId = @DepartmentId,
          DesignationId = @DesignationId,
          BranchId = @BranchId,
          DateOfJoin = @DateOfJoin,
          DateOfResign = @DateOfResign,
          NID = @NID,
          PersonalContactNumber = @PersonalContactNumber,
          OfficalContactNumber = @OfficalContactNumber,
          Email = @Email,
          EmployeeType = @EmployeeType,
          Gender = @Gender,
          MaritalStatus = @MaritalStatus,
          BloodGroup = @BloodGroup,
          FatherName = @FatherName,
          MotherName = @MotherName,
          PresentAddress = @PresentAddress,
          PermanentAddress = @PermanentAddress,
          Status = @Status,
          UpdatedBy = @UpdatedBy,
          UpdatedDate = @UpdatedDate
        WHERE EmployeeId = @EmployeeId
      `);

      return res.json({ message: "Employee profile updated successfully" });
    }

    if (data.type === "shift") {
      // Update only shift
      const shiftRequest = new sql.Request();
      shiftRequest.input("EmployeeId", sql.NVarChar, data.EmployeeId);
      shiftRequest.input("ShiftSchedule", sql.NVarChar, data.ShiftSchedule);
      shiftRequest.input("UpdatedBy", sql.NVarChar, updatedBy);
      shiftRequest.input("UpdatedDate", sql.DateTime, updatedDate);

      await shiftRequest.query(`
        UPDATE [TA].[dbo].[Employee]
        SET 
          ShiftSchedule = @ShiftSchedule,
          UpdatedBy = @UpdatedBy,
          UpdatedDate = @UpdatedDate
        WHERE EmployeeId = @EmployeeId
      `);

      return res.json({ message: "Employee shift updated successfully" });
    }

  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { updateEmployee };

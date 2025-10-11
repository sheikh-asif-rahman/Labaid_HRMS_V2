const { sql } = require("../../config/dbConfig");
const moment = require("moment");
const crypto = require("crypto");

// Helper function to hash password
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const updateEmployee = async (req, res) => {
  try {
    const data = req.body;

    if (!data.EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }
    if (!data.type || !["profile", "shift"].includes(data.type)) {
      return res.status(400).json({ message: "type must be 'profile' or 'shift'" });
    }

    const now = moment().toDate();
    const updatedBy = data.UserId || "SYSTEM";
    const createdBy = data.UserId || "SYSTEM";

    // 1. Check if employee exists
    const empRequest = new sql.Request();
    empRequest.input("EmployeeId", sql.NVarChar, data.EmployeeId);
    const empResult = await empRequest.query(`
      SELECT * 
      FROM [TA].[dbo].[Employee]
      WHERE EmployeeId = @EmployeeId
    `);

    const employeeExists = empResult.recordset.length > 0;

    // 2. If employee does NOT exist and type is 'profile', create a new record
    if (!employeeExists && data.type === "profile") {
      const insertRequest = new sql.Request();
      insertRequest.input("EmployeeId", sql.NVarChar, data.EmployeeId);
      insertRequest.input("EmployeeName", sql.NVarChar, data.EmployeeName || "Unknown");
      insertRequest.input("DepartmentId", sql.NVarChar, data.DepartmentId || null);
      insertRequest.input("DesignationId", sql.NVarChar, data.DesignationId || null);
      insertRequest.input("BranchId", sql.NVarChar, data.BranchId || null);
      insertRequest.input("DateOfJoin", sql.Date, data.DateOfJoin || null);
      insertRequest.input("DateOfResign", sql.Date, data.DateOfResign || null);
      insertRequest.input("NID", sql.NVarChar, data.NID || null);
      insertRequest.input("PersonalContactNumber", sql.NVarChar, data.PersonalContactNumber || null);
      insertRequest.input("OfficalContactNumber", sql.NVarChar, data.OfficalContactNumber || null);
      insertRequest.input("Email", sql.NVarChar, data.Email || null);
      insertRequest.input("EmployeeType", sql.NVarChar, data.EmployeeType || null);
      insertRequest.input("Gender", sql.NVarChar, data.Gender || null);
      insertRequest.input("MaritalStatus", sql.NVarChar, data.MaritalStatus || null);
      insertRequest.input("BloodGroup", sql.NVarChar, data.BloodGroup || null);
      insertRequest.input("FatherName", sql.NVarChar, data.FatherName || null);
      insertRequest.input("MotherName", sql.NVarChar, data.MotherName || null);
      insertRequest.input("PresentAddress", sql.NVarChar, data.PresentAddress || null);
      insertRequest.input("PermanentAddress", sql.NVarChar, data.PermanentAddress || null);
      insertRequest.input("Status", sql.NVarChar, data.Status || "active");

      // Hash password if provided
      const hashedPassword = data.Password ? hashPassword(data.Password) : null;
      insertRequest.input("Password", sql.NVarChar, hashedPassword);

      // Default permission for first-time user
      const defaultPermission = JSON.stringify({
        Access: ["Overview", "Leave Management", "Yearly Calendar"],
        Special_Permission: [],
      });
      insertRequest.input("Permission", sql.NVarChar, defaultPermission);

      // Default shift schedule for first-time user
      const defaultShift = "SAT[FULLDAY],SUN[FULLDAY],MON[FULLDAY],TUE[FULLDAY],WED[FULLDAY],THU[FULLDAY],FRI[OFFDAY]";
      insertRequest.input("ShiftSchedule", sql.NVarChar, defaultShift);

      insertRequest.input("CreatedBy", sql.NVarChar, createdBy);
      insertRequest.input("CreatedDate", sql.DateTime, now);
      insertRequest.input("UpdatedBy", sql.NVarChar, updatedBy);
      insertRequest.input("UpdatedDate", sql.DateTime, now);

      await insertRequest.query(`
        INSERT INTO [TA].[dbo].[Employee] 
        (EmployeeId, EmployeeName, DepartmentId, DesignationId, BranchId, DateOfJoin, DateOfResign, NID, PersonalContactNumber, OfficalContactNumber, Email, EmployeeType, Gender, MaritalStatus, BloodGroup, FatherName, MotherName, PresentAddress, PermanentAddress, Status, Password, Permission, ShiftSchedule, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate)
        VALUES
        (@EmployeeId, @EmployeeName, @DepartmentId, @DesignationId, @BranchId, @DateOfJoin, @DateOfResign, @NID, @PersonalContactNumber, @OfficalContactNumber, @Email, @EmployeeType, @Gender, @MaritalStatus, @BloodGroup, @FatherName, @MotherName, @PresentAddress, @PermanentAddress, @Status, @Password, @Permission, @ShiftSchedule, @CreatedBy, @CreatedDate, @UpdatedBy, @UpdatedDate)
      `);

      return res.json({ message: "Employee created successfully with default permissions and shift schedule" });
    }

    // 3. If employee exists, update profile or shift
    if (employeeExists) {
      if (data.type === "profile") {
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
        updateRequest.input("UpdatedDate", sql.DateTime, now);

        // If password is provided, hash it and include in update
        if (data.Password) {
          const hashedPassword = hashPassword(data.Password);
          updateRequest.input("Password", sql.NVarChar, hashedPassword);
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
              Password = @Password,
              UpdatedBy = @UpdatedBy,
              UpdatedDate = @UpdatedDate
            WHERE EmployeeId = @EmployeeId
          `);
        } else {
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
              Password = @Password,
              UpdatedBy = @UpdatedBy,
              UpdatedDate = @UpdatedDate
            WHERE EmployeeId = @EmployeeId
          `);
        }

        return res.json({ message: "Employee profile updated successfully" });
      }

      if (data.type === "shift") {
        const shiftRequest = new sql.Request();
        shiftRequest.input("EmployeeId", sql.NVarChar, data.EmployeeId);
        shiftRequest.input("ShiftSchedule", sql.NVarChar, data.ShiftSchedule);
        shiftRequest.input("UpdatedBy", sql.NVarChar, updatedBy);
        shiftRequest.input("UpdatedDate", sql.DateTime, now);

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
    }

    return res.status(400).json({ message: "Invalid operation" });
  } catch (error) {
    console.error("Error updating/creating employee:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { updateEmployee };

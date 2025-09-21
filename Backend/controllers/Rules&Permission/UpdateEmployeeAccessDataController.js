const { sql } = require("../../config/dbConfig");

const updateEmployeeAccessData = async (req, res) => {
  try {
    const { EmployeeId, Permission, AccessToBranchId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }

    // Keep only Access and Special_Permission
    const permissionData = Permission
      ? {
          Access: Permission.Access || [],
          Special_Permission: Permission.Special_Permission || []
        }
      : { Access: [], Special_Permission: [] };

    const permissionStr = JSON.stringify(permissionData);

    const request = new sql.Request();
    request.input("EmployeeId", sql.NVarChar, EmployeeId);
    request.input("Permission", sql.NVarChar, permissionStr);
    request.input("AccessToBranchId", sql.NVarChar, AccessToBranchId || "");

    const query = `
      UPDATE [TA].[dbo].[Employee]
      SET 
        [Permission] = @Permission,
        [AccessToBranchId] = @AccessToBranchId
      WHERE [EmployeeId] = @EmployeeId
    `;

    await request.query(query);

    return res.status(200).json({ message: "Employee access updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { updateEmployeeAccessData };

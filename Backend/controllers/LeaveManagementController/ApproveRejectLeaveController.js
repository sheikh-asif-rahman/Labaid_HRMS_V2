// controllers/LeaveManagementController/ApproveRejectLeaveController.js
const { sql } = require("../../config/dbConfig");

const updateApproveRejectLeave = async (req, res) => {
  try {
    const { EmployeeId, ApplicationDate, Status, UpdatedBy } = req.body;

    // 🔹 Validation
    if (!EmployeeId || !ApplicationDate || !Status || !UpdatedBy) {
      return res.status(400).json({
        success: false,
        message: "EmployeeId, ApplicationDate, Status, and UpdatedBy are required",
      });
    }

    if (!["Approved", "Rejected"].includes(Status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'",
      });
    }

    // 🔹 Update query (exact column names)
    const query = `
      UPDATE [TA].[dbo].[leave]
      SET [Status] = @Status,
          [Approved/Rejected By] = @UpdatedBy,
          [Approved/Rejected Date] = GETDATE()
      WHERE [EmployeeId] = @EmployeeId AND [ApplicationDate] = @ApplicationDate
    `;

    const request = new sql.Request();
    request.input("Status", sql.NVarChar, Status);
    request.input("UpdatedBy", sql.NVarChar, UpdatedBy);
    request.input("EmployeeId", sql.NVarChar, EmployeeId);
    request.input("ApplicationDate", sql.DateTime, ApplicationDate);

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching leave record found for this EmployeeId and ApplicationDate.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Leave ${Status.toLowerCase()} successfully.`,
    });
  } catch (error) {
    console.error("❌ Error updating leave approval/rejection:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { updateApproveRejectLeave };

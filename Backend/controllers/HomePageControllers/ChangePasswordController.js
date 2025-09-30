const { sql } = require("../../config/dbConfig");
const crypto = require("crypto");

// Helper function to hash password
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const changePassword = async (req, res) => {
  try {
    const { EmployeeId, oldPassword, newPassword } = req.body;

    if (!EmployeeId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pool = await sql.connect();

    // Hash the old password
    const hashedOldPassword = hashPassword(oldPassword);

    // Check if Employee exists with matching old password
    const result = await pool.request()
      .input("EmployeeId", sql.NVarChar, EmployeeId)
      .input("Password", sql.NVarChar, hashedOldPassword)
      .query("SELECT * FROM [TA].[dbo].[Employee] WHERE [EmployeeId] = @EmployeeId AND [Password] = @Password");

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash the new password
    const hashedNewPassword = hashPassword(newPassword);

    // Update the password
    await pool.request()
      .input("EmployeeId", sql.NVarChar, EmployeeId)
      .input("NewPassword", sql.NVarChar, hashedNewPassword)
      .query("UPDATE [TA].[dbo].[Employee] SET [Password] = @NewPassword WHERE [EmployeeId] = @EmployeeId");

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { changePassword };

const { sql } = require("../config/dbConfig");
const crypto = require("crypto");

// Login controller with hashed password
const loginUser = async (req, res) => {
  try {
    const { EmployeeId, Password } = req.body;

    if (!EmployeeId || !Password) {
      return res.status(400).json({ message: "EmployeeId and Password are required" });
    }

    const request = new sql.Request();
    request.input("EmployeeId", sql.VarChar, EmployeeId);

    const result = await request.query(`
      SELECT EmployeeId, Password, Permission, Status
      FROM dbo.Employee
      WHERE EmployeeId = @EmployeeId
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { Password: storedPassword, Permission, Status } = result.recordset[0];

    if (Status === "Inactive" || Status === "Lock") {
      return res.status(403).json({ message: `Your account is ${Status}` });
    }

    // Hash the password from the request
    const hash = crypto.createHash("sha256").update(Password).digest("hex");

    if (hash !== storedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "Login successful",
      EmployeeId,
      Permission,
      Status
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser };

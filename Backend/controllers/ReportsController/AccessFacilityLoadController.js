const { sql } = require("../../config/dbConfig");

// POST: Load Access Facility by EmployeeId
const getAccessFacility = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    // 1. Get AccessToBranchId from Employee table
    const empRequest = new sql.Request();
    empRequest.input("EmployeeId", sql.NVarChar, employeeId);

    const empResult = await empRequest.query(`
      SELECT AccessToBranchId
      FROM [TA].[dbo].[Employee]
      WHERE EmployeeId = @EmployeeId
    `);

    if (empResult.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const accessIdsRaw = empResult.recordset[0].AccessToBranchId;
    if (!accessIdsRaw) {
      return res.json({ EmployeeId: employeeId, AccessCount: 0, Devices: [] });
    }

    // 2. Split CSV into array
    const accessIds = accessIdsRaw.split(",").map((id) => id.trim());

    if (accessIds.length === 0) {
      return res.json({ EmployeeId: employeeId, AccessCount: 0, Devices: [] });
    }

    // 3. Get matching devices
    const deviceRequest = new sql.Request();
    const placeholders = accessIds.map((_, i) => `@id${i}`).join(",");
    accessIds.forEach((id, i) => deviceRequest.input(`id${i}`, sql.NVarChar, id));

    const deviceResult = await deviceRequest.query(`
      SELECT id, name
      FROM [TA].[dbo].[Device]
      WHERE id IN (${placeholders})
      ORDER BY name
    `);

    return res.json({
      EmployeeId: employeeId,
      AccessCount: deviceResult.recordset.length,
      Devices: deviceResult.recordset,
    });

  } catch (error) {
    console.error("Error fetching access facilities:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { getAccessFacility };

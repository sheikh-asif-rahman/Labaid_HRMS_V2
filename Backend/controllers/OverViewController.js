// backend/controllers/OverViewController.js
const sql = require("mssql"); // assuming you use mssql

const overview = async (req, res) => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const query = `
      SELECT 
        d.id AS deviceId,
        d.name AS deviceName,
        COUNT(e.employeeid) AS totalEmployees,
        SUM(CASE WHEN p.user_id IS NOT NULL THEN 1 ELSE 0 END) AS presentCount,
        SUM(CASE WHEN p.user_id IS NULL THEN 1 ELSE 0 END) AS absentCount
      FROM [TA].[dbo].[device] d
      LEFT JOIN [TA].[dbo].[Employee] e ON e.BranchId = d.id
      LEFT JOIN (
        SELECT DISTINCT user_id
        FROM [TA].[dbo].[punchlog]
        WHERE CAST(devdt AS DATE) = '${todayStr}'
      ) p ON p.user_id = e.employeeid
      GROUP BY d.id, d.name
      ORDER BY d.id
    `;

    const result = await sql.query(query);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { overview };

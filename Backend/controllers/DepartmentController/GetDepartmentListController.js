const { sql } = require("../../config/dbConfig");

const getDepartmentList = async (req, res) => {
  try {
    const query = `
      SELECT [DepartmentID],
             [DepartmentName],
             [Status]
      FROM [TA].[dbo].[Department]
    `;

    const result = await sql.query(query); // using your sql directly

    res.status(200).json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch department list"
    });
  }
};

module.exports = { getDepartmentList };

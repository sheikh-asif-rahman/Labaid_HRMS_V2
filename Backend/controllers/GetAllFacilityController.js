const { sql } = require("../config/dbConfig");

const getAllFacility = async (req, res) => {
  try {
    const query = `
      SELECT [id], [name]
      FROM [TA].[dbo].[device]
    `;

    const result = await sql.query(query);

    res.status(200).json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch facilities"
    });
  }
};

module.exports = { getAllFacility };

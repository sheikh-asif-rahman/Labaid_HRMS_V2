const { sql } = require("../../config/dbConfig");

const getDesignationList = async (req, res) => {
  try {
    const query = `
      SELECT [DesignationID] AS id,
             [DesignationName] AS name,
             [Status]
      FROM [dbo].[Designation]
    `;

    const result = await sql.query(query);

    res.status(200).json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error("Error fetching designations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch designation list"
    });
  }
};

module.exports = { getDesignationList };

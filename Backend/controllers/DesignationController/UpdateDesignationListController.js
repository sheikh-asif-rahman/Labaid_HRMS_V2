const { sql } = require("../../config/dbConfig");

const updateDesignationList = async (req, res) => {
  try {
    const { type, id, name, status, user } = req.body;

    if (!type || !name || !user) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const nameTrimmed = name.trim();

    // Check for duplicate name
    let duplicateQuery = `
      SELECT COUNT(*) AS count
      FROM [dbo].[Designation]
      WHERE UPPER(DesignationName) = UPPER('${nameTrimmed}')
    `;

    if (type === "update" && id) {
      // Exclude current row for update
      duplicateQuery += ` AND DesignationID != ${id}`;
    }

    const duplicateCheck = await sql.query(duplicateQuery);

    if (duplicateCheck.recordset[0].count > 0) {
      return res.status(400).json({ success: false, message: "Designation name already exists" });
    }

    if (type === "save") {
      // Insert new designation
      const query = `
        INSERT INTO [dbo].[Designation] (DesignationName, Status, CreatedBy, CreatedDate)
        VALUES ('${nameTrimmed}', 1, '${user}', GETDATE());
      `;
      await sql.query(query);

      return res.status(200).json({ success: true, message: "Designation saved successfully" });

    } else if (type === "update") {
      if (!id) {
        return res.status(400).json({ success: false, message: "ID is required for update" });
      }

      // Update existing designation
      const query = `
        UPDATE [dbo].[Designation]
        SET DesignationName = '${nameTrimmed}',
            Status = ${status ? 1 : 0},
            UpdatedBy = '${user}',
            UpdatedDate = GETDATE()
        WHERE DesignationID = ${id};
      `;
      await sql.query(query);

      return res.status(200).json({ success: true, message: "Designation updated successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }
  } catch (error) {
    console.error("Error updating designation:", error);
    res.status(500).json({ success: false, message: "Failed to update designation" });
  }
};

module.exports = { updateDesignationList };

const { sql } = require("../../config/dbConfig");

const updateDepartmentList = async (req, res) => {
  try {
    const { type, id, name, status, user } = req.body;

    if (!type || !name || !user) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const nameTrimmed = name.trim();

    // Check for duplicate name
    let duplicateQuery = `
      SELECT COUNT(*) AS count
      FROM [dbo].[Department]
      WHERE UPPER(DepartmentName) = UPPER('${nameTrimmed}')
    `;

    if (type === "update" && id) {
      // Exclude current row for update
      duplicateQuery += ` AND DepartmentID != ${id}`;
    }

    const duplicateCheck = await sql.query(duplicateQuery);

    if (duplicateCheck.recordset[0].count > 0) {
      return res.status(400).json({ success: false, message: "Department name already exists" });
    }

    if (type === "save") {
      // Insert new department
      const query = `
        INSERT INTO [dbo].[Department] (DepartmentName, Status, CreatedBy, CreatedDate)
        VALUES ('${nameTrimmed}', 1, '${user}', GETDATE());
      `;
      await sql.query(query);

      return res.status(200).json({ success: true, message: "Department saved successfully" });

    } else if (type === "update") {
      if (!id) {
        return res.status(400).json({ success: false, message: "ID is required for update" });
      }

      // Update existing department
      const query = `
        UPDATE [dbo].[Department]
        SET DepartmentName = '${nameTrimmed}',
            Status = ${status ? 1 : 0},
            UpdatedBy = '${user}',
            UpdatedDate = GETDATE()
        WHERE DepartmentID = ${id};
      `;
      await sql.query(query);

      return res.status(200).json({ success: true, message: "Department updated successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ success: false, message: "Failed to update department" });
  }
};

module.exports = { updateDepartmentList };

const sql = require("mssql");

const dbConfig = {
  user: "asif",
  password: "77776666",
  server: "DESKTOP-0UHUJ9E",
  database: "TA",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: "SQLEXPRESS",
  },
  port: 1433,
};

const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Connected to database successfully!");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};

module.exports = { sql, connectDB };

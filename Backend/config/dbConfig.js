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



// const sql = require('mssql');

// const dbConfig = {
//     user: "sa",
//     password: "L@b@id#?$%238",
//     server: "103.125.253.241",
//     database: "TA",
//     options: {
//         trustServerCertificate: true,
//         trustedConnection: false,
//         enableArithAbort: true,
//         instancename: "SQLEXPRESS",
//         requestTimeout: 30000, // Increase timeout to 30 seconds

//     },
//     port: 1431,
// };

// // Database connection
// const connectDB = async () => {
//     try {
//         await sql.connect(dbConfig);
//         console.log("Connected to the database successfully!");
//     } catch (err) {
//         console.error("Database connection failed:", err);
//         throw err;
//     }
// };

// module.exports = { sql, connectDB };

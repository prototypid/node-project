const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-practice",
  password: "1324",
});

module.exports = pool.promise();

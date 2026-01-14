const mysql = require("mysql2");

/**
 * Database Singleton
 * Provides a single shared database connection for the entire application.
 * This prevents creating multiple connections and helps manage resources efficiently.
 */

let connection = null;

/**
 * Creates and returns a MySQL database connection.
 * If a connection already exists, it returns the existing one.
 * 
 * @returns {Object} MySQL connection object
 */
function getConnection() {
  if (!connection) {
    connection = mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "testdb",
    });

    connection.connect((err) => {
      if (err) {
        console.error("Database connection error:", err);
        return;
      }
      console.log("Connected to MySQL database");
    });
  }

  return connection;
}

module.exports = { getConnection };

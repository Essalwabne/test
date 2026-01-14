const mysql = require("mysql2");

/**
 * Database Singleton
 * Provides a single shared database connection for the entire application.
 * This prevents creating multiple connections and helps manage resources efficiently.
 */

let connection = null;
let connectionError = null;

/**
 * Creates and returns a MySQL database connection.
 * If a connection already exists, it returns the existing one.
 * 
 * @returns {Object} MySQL connection object
 * @throws {Error} If connection fails and hasn't been established
 */
function getConnection() {
  if (connectionError) {
    throw connectionError;
  }

  if (!connection) {
    const config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "testdb",
    };

    connection = mysql.createConnection(config);

    connection.connect((err) => {
      if (err) {
        connectionError = new Error(
          `Database connection failed to ${config.host}/${config.database}: ${err.message}`
        );
        console.error(connectionError.message);
        connection = null;
        return;
      }
      console.log(`Connected to MySQL database at ${config.host}/${config.database}`);
    });
  }

  return connection;
}

module.exports = { getConnection };

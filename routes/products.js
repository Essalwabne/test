// const express = require("express");
// const router = express.Router();
// //routes/user.js
// const dbSingleton = require("../dbSingleton");

// // Execute a query to the database
// const db = dbSingleton.getConnection();


// // نفحص إذا الجدول موجود
// const checkTable = `
// SHOW TABLES LIKE 'products';
// `;

// db.query(checkTable, (err, results) => {
//   if (err) {
//     console.log("Error checking table:", err);
//     return;
//   }

//   if (results.length === 0) {
//     // الجدول غير موجود → ننشئه
//     const createTable = `
//     CREATE TABLE products (
//       id INT NOT NULL AUTO_INCREMENT,
//       name VARCHAR(100),
//       price DECIMAL(10,2),
//       description TEXT,
//       PRIMARY KEY (id)
//     )
//     `;

//     db.query(createTable, (errC) => {
//       if (errC) {
//         console.log("Error creating table:", errC);
//         return;
//       }
//       console.log("Table products created (it was not found).");
//       process.exit();
//     });
//   } else {
//     console.log("Table products already exists. No action needed.");
//     process.exit();
//   }
// });

const express = require("express");
const router = express.Router();
const dbSingleton = require("../dbSingleton");

/*
 * Get a shared database connection (Singleton pattern).
 * Ensures the app uses one DB connection instead of opening many.
 */
const db = dbSingleton.getConnection();

/*
 * ensureTable()
 * -------------
 * This function checks if the `products` table exists.
 * If it does not exist, it creates the table automatically.
 *
 * This runs ONCE when the routes file is loaded.
 * It is not tied to any HTTP request.
 */
function ensureTable() {
  const checkTable = "SHOW TABLES LIKE 'products';";

  db.query(checkTable, (err, results) => {
    if (err) {
      console.log("Error checking table:", err);
      return;
    }

    // If no table found → create it
    if (results.length === 0) {
      const createTable = `
        CREATE TABLE products (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(100),
          price DECIMAL(10,2),
          PRIMARY KEY (id)
        );
      `;

      db.query(createTable, (errC) => {
        if (errC) {
          console.log("Error creating table:", errC);
          return;
        }
        console.log("Table products created (it was not found).");
      });
    } else {
      console.log("Table products already exists. No action needed.");
    }
  });
}

// Run table check on startup
ensureTable();

/*
 * POST /products
 * ---------------
 * Creates a new product.
 */
router.post("/", (req, res) => {
  const { name, price } = req.body;

  // Validate product name
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Name must be a non-empty string.",
    });
  }

  // Validate product price
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({
      message: "Price must be a valid non-negative number.",
    });
  }

  /*
   * Check if product already exists (by name).
   * This prevents duplicate products.
   */
  const checkQuery = "SELECT id FROM products WHERE name = ?";

  db.query(checkQuery, [name.trim()], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    // If product exists → conflict
    if (results.length > 0) {
      return res.status(409).json({
        message: "Product already exists.",
      });
    }

    /*
     * Insert product only if it does not already exist.
     */
    const insertQuery = "INSERT INTO products (name, price) VALUES (?, ?)";

    db.query(insertQuery, [name.trim(), numericPrice], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Return newly created product ID
      return res.status(201).json({
        message: "Product added successfully.",
        id: results.insertId,
      });
    });
  });
});

/*
 * PUT /products/:id
 * ------------------
 * Updates an existing product by ID.
 */
router.put("/:id", (req, res) => {
  const numericId = Number(req.params.id);

  // Validate ID
  if (Number.isNaN(numericId) || numericId <= 0) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const { name, price } = req.body;

  // Validate name
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Name must be a non-empty string.",
    });
  }

  // Validate price
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({
      message: "Price must be a valid non-negative number.",
    });
  }

  const query = "UPDATE products SET name = ?, price = ? WHERE id = ?";

  db.query(query, [name.trim(), numericPrice, numericId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    // If no rows updated → product not found
    if (results.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json({ message: "Product updated!" });
  });
});

/*
 * GET /products/:id
 * ------------------
 * Returns a single product by ID.
 */
router.get("/:id", (req, res) => {
  const numericId = Number(req.params.id);

  // Validate ID
  if (Number.isNaN(numericId) || numericId <= 0) {
    return res.status(400).json({
      message: "Invalid product id.",
    });
  }

  const query = "SELECT * FROM products WHERE id = ?";

  db.query(query, [numericId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Product not found
    if (results.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    // Return the product
    return res.json(results[0]);
  });
});

/*
 * DELETE /products/:id
 * ---------------------
 * Deletes a product by ID.
 */
router.delete("/:id", (req, res) => {
  const numericId = Number(req.params.id);

  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [numericId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.json({ message: "Product deleted!" });
  });
});

/*
 * GET /products
 * --------------
 * Returns all products.
 * Supports optional `limit` query parameter.
 *
 * Examples:
 *   GET /products
 *   GET /products?limit=5
 */
router.get("/", (req, res, next) => {
  const { limit } = req.query;

  // Validate limit if provided
  if (limit && isNaN(limit)) {
    return res.status(400).json({
      error: 'Parameter "limit" must be a number',
    });
  }

  const query = limit
    ? "SELECT * FROM products LIMIT ?"
    : "SELECT * FROM products";

  const params = limit ? [parseInt(limit, 10)] : [];

  db.query(query, params, (err, results) => {
    if (err) {
      return next(err);
    }

    return res.json(results);
  });
});

module.exports = router;

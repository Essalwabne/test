const express = require("express");
const router = express.Router();
//routes/user.js
const dbSingleton = require("../dbSingleton");

// Execute a query to the database
const db = dbSingleton.getConnection();

router.get("/", (req, res) => {
  const query = " SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });

  //routes/user.js

  router.post("/", (req, res) => {
    const { name, email, password } = req.body;
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ message: "User added!", id: results.insertId });
    });
  });


  //routes/user.js

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { name, email, password } = req.body;
	const query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
	db.query(query, [name, email, password, id], (err, results) => {
	    if (err) {
	    res.status(500).send(err);
	    return;
	    }
	    res.json({ message: 'User updated!' });
	});
});


//routes/user.js

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	const query = 'DELETE FROM users WHERE id = ?';
	db.query(query, [id], (err, results) => {
	    if (err) {
	    res.status(500).send(err);
	    return;
	    }
	    res.json({ message: 'User deleted!' });
	});
});


});
module.exports = router;

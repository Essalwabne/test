const express = require("express");
const app = express();
const userRoutes = require("./routes/user");

const port = 3000;
// node tasks
app.use(express.json());

app.use("/users", userRoutes);
// app.use("/products",)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

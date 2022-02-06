const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/signup", (req, res) => {
  res.json({ result: true });
  console.log(req.body);
});

app.listen(8080, console.log("app listening"));

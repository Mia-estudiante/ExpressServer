const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const PORT = 8080;
// const whitelist = ["https://github.com/Mia-estudiante/WebSite"];

require("dotenv").config();
// app.use(cors({ origin: whitelist }));
app.use(cors());
app.use(express.json());

//1)
const connection = mysql.createConnection({
  host: process.env.DB_HOST, //mysql ip
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
});
// console.log(connection);

connection.connect(function (err) {
  if (err) {
    console.log("Cannot connect");
    throw err;
  } else {
    console.log("Connection established.");
  }
});

//2)
// const pool = mysql.createPool({
//   host: process.env.DB_HOST, //mysql ip
//   user: process.env.DB_USER,
//   password: process.env.DB_PW,
//   port: parseInt(process.env.DB_PORT),
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// pool.getConnection(function (err, conn) {
// if (!err) {
//  conn.query("SELECT host, user FROM user");
// }
// console.log(err);
//conn.release();
//});

/*
CREATE TABLE user_info (
  id VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  year INT(4) NOT NULL,
  month INT(3) NOT NULL,
  date INT(3) NOT NULL
  PRIMARY KEY (id)
);

CREATE TABLE user_encrypt (
	id VARCHAR(100) NOT NULL,
	pw VARCHAR(100) NOT NULL,
	salt VARCHAR(30) NOT NULL,
	PRIMARY KEY (id)
);
*/

//회원가입
app.post("/signup", (req, res) => {
  const request = req.body;
  const id = request.id;
  const pw = request.pw;
  const name = request.name;
  const birth = request.birth;

  console.log(id, pw, name, birth);
});

app.listen(PORT, console.log("app listening"));

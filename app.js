const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "172.17.0.2",
  user: "root",
  password: "passwordmysql",
  port: 3306,
  database: "db_user",
});
connection.connect();

// connection.query("SELECT * FROM table", function (err, results, fields) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(results);
// });

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

app.listen(8080, console.log("app listening"));

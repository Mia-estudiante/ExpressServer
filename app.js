const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
// const { json } = require("express/lib/response");
const PORT = 8080;
// const whitelist = ["https://mia-estudiante.github.io/WebSite/"];

require("dotenv").config();
// app.use(cors({ origin: whitelist }));
app.use(cors());
app.use(express.json());

//MySQL 연결
const connection = mysql.createConnection({
  host: process.env.DB_HOST, //mysql ip
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

let email;
const emailQuery = `SELECT EXISTS(SELECT id FROM user_info WHERE id='`;
let isValidEmail = false;

//회원가입
app.post("/signup", (req, res) => {
  const request = req.body.data;

  const id = request.id;
  const pw = request.pw; //암호화
  const name = request.name;
  const birth = request.birth;
  console.log(id, pw, name, birth);

  //1. 이미 존재하는 이메일인가?
  email = id;
  connection.query(emailQuery + `${email}')`, (err, rows, fields) => {
    if (err) {
      throw err;
    }

    for (let key in rows) {
      key == 0 ? (isValidEmail = true) : (isValidEmail = false);
    }
    res.json([{ result: isValidEmail }]);
  });

  //2. user_info - id, name, birth 기록
  const UIQuery = `INSERT INTO user_info (id, name, birth) VALUE ('${id}', '${name}', '${birth}')`;
  connection.query(UIQuery, (err, rows, fields) => {
    if (err) {
      throw err;
    }
  });

  //3. user_encrypt - id, pw, salt 기록 -> 암호화
});

app.listen(PORT, console.log("app listening"));

/*
CREATE TABLE user_info (
  id VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  birth VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE user_encrypt (
	id VARCHAR(100) NOT NULL,
	pw VARCHAR(100) NOT NULL,
	salt VARCHAR(30) NOT NULL,
	PRIMARY KEY (id)
);
*/

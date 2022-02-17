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

let id, pw, name, birth;
const getUserInfo = function (req, res, next) {
  const request = req.body;
  id = request.id;
  pw = request.pw; //암호화
  name = request.name;
  birth = request.birth;
  // console.log(id, pw, name, birth);
  console.log("1");
  next();
};

const emailQuery = `SELECT EXISTS(SELECT id FROM user_info WHERE id='`;
let isValidEmail = false;

const checkValidEmail = function (req, res, next) {
  //1. 이미 존재하는 이메일인가?
  connection.query(emailQuery + `${id}')`, (err, rows, fields) => {
    if (err) {
      throw err;
    }
    const key = Object.keys(rows[0])[0];
    console.log(rows);
    rows[0][key] == 0 ? (isValidEmail = true) : (isValidEmail = false);
    console.log(isValidEmail);
    console.log("checking Before " + isValidEmail); //실행순서 2
  });
  console.log(isValidEmail);
  next(isValidEmail);
};

const insertUserInfo = function (req, res, next) {
  //2. user_info - id, name, birth 기록
  console.log(isValidEmail);
  if (!isValidEmail) {
    connection.end();
  } else {
    // console.log("insert");
    const UIQuery = `INSERT INTO user_info (id, name, birth) VALUE ('${id}', '${name}', '${birth}')`;
    connection.query(UIQuery, (err, rows, fields) => {
      if (err) {
        throw err;
      }
    });
  }
  res.json({ result: isValidEmail });
  console.log("3");
  next();
};

//동기처리!!
app.use(getUserInfo);
app.use(checkValidEmail);
app.use(insertUserInfo);

//회원가입
app.post("/signup", (req, res) => {
  // console.log("checking After " + isValidEmail); //실행순서 1

  //3. user_encrypt - id, pw, salt 기록 -> 암호화
  console.log("4");
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

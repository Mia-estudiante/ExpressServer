"use strict";

const connection = require("../app"); //MySQL 연결
let id, pw, name, birth;
const getUserInfo = (req, res, next) => {
  const request = req.body;

  id = request.id;
  pw = request.pw; //암호화
  name = request.name;
  birth = request.birth;
  console.log(id, pw, name, birth);
  console.log("1");
  next();
};

const emailQuery = `SELECT EXISTS(SELECT id FROM user_info WHERE id='`;
let isValidEmail = false;

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

module.exports = {
  getUserInfo,
  insertUserInfo,
  checkValidEmail,
};

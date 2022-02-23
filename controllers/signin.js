"use strict";

const connection = require("../app"); //MySQL 연결
const crypto = require("crypto");

let id, pw;
const getUserInfo = (req, res, next) => {
  const request = req.body;
  id = request.id;
  pw = request.pw;
  console.log(id, pw);
  next();
};

const checkID = (req, res, next) => {
  const existIDQuery = `SELECT EXISTS(SELECT * FROM user_info WHERE id=?)`;

  connection.query(existIDQuery, [id], (err, rows, fields) => {
    if (err) {
      throw err;
    }
    const key = Object.keys(rows[0])[0];
    if (rows[0][key] == 0) {
      res.json({ result: false });
    } else {
      next();
    }
  });
};

const checkPW = (req, res, next) => {
  console.log("등록된 아이디");
  const pwsaltQuery = `SELECT pw, salt FROM user_encrypt WHERE id=?`;
  //   let pw, salt;
  connection.query(pwsaltQuery, [id], (err, rows, fields) => {
    if (err) {
      throw err;
    }
    const hashPassword = rows[0].pw;
    const salt = rows[0].salt;

    //pw: 사용자가 입력한 패스워드
    //hashPassword: DB에 등록된 패스워드
    crypto.pbkdf2(pw, salt, 256, 32, "sha512", (err, key) => {
      if (err) {
        console.log(err);
      }

      const hash = key.toString("base64");
      hashPassword === hash
        ? res.json({ result: true })
        : res.json({ result: false });
    });
  });
};

module.exports = {
  getUserInfo,
  checkID,
  checkPW,
};

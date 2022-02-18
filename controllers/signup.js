"use strict";

const connection = require("../app"); //MySQL 연결
const crypto = require("crypto");
// const { captureRejectionSymbol } = require("events");

let id, pw, name, birth;
const getUserInfo = (req, res, next) => {
  const request = req.body;
  id = request.id;
  pw = request.pw; //암호화
  name = request.name;
  birth = request.birth;
  console.log(id, pw, name, birth);
  next();
};

const insertUserInfo = function (req, res, next) {
  //2. user_info - id, name, birth 기록
  const UIQuery = `INSERT INTO user_info (id, name, birth) VALUE ('${id}', '${name}', '${birth}')`;
  connection.query(UIQuery, (err, rows, fields) => {
    if (err) {
      throw err;
    }
  });

  next();
};

const insertUserEncrypt = function (req, res, next) {
  //3. user_encrypt - id, name, birth 기록
  const salt = crypto.randomBytes(16).toString("base64");
  const hashPassword = crypto
    .createHash("sha512")
    .update(pw + salt)
    .digest("hex"); //or 'base64'

  //복호화 확인해보기!!!!
  // const decipher = crypto.createDecipheriv("aes-512-cbc", salt);
  // console.log(decipher);

  const UEQuery = `INSERT INTO user_encrypt (id, pw, salt) VALUE ('${id}', '${hashPassword}', '${salt}')`;
  connection.query(UEQuery, (err, rows, fields) => {
    if (err) {
      throw err;
    }
  });

  res.json({ result: true });
};

module.exports = {
  getUserInfo,
  insertUserInfo,
  insertUserEncrypt,
};

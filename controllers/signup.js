"use strict";

const connection = require("../app"); //MySQL 연결
const crypto = require("crypto");
// const pbkdf2Password = require("pbkdf2-password"); //salt 자동 생성
// const hasher = pbkdf2Password();

let id, pw, name, birth;
const getUserInfo = (req, res, next) => {
  const request = req.body;
  id = request.id;
  pw = request.pw;
  name = request.name;
  birth = request.birth;
  console.log(id, pw, name, birth);
  next();
};

let No;
/**
 * user_info 테이블
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const insertUserInfo = function (req, res, next) {
  //2. user_info - id, name, birth 기록
  const CountQuery = `SELECT COUNT(*) FROM user_info`;
  connection.query(CountQuery, (err, rows, fields) => {
    if (err) {
      throw err;
    }
    const key = Object.keys(rows[0])[0];
    No = ++rows[0][key];

    const UIQuery = `INSERT INTO user_info (No, id, name, birth) VALUE (${No}, ${connection.escape(
      id
    )}, ${connection.escape(name)}, ${connection.escape(birth)})`;
    connection.query(UIQuery, (err, rows, fields) => {
      if (err) {
        throw err;
      }
    });
    next();
  });
};

/**
 * user_encrypt 테이블
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const insertUserEncrypt = function (req, res, next) {
  //3. user_encrypt - id, pw, salt 기록
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      throw err;
    }
    /** salt 생성
     * 1) base64: 64진수 + 용량 적음
     * 2) hex: 16진수 + 용량 큼
     */
    const salt = buf.toString("base64");

    /**
     *  평문 pw, salt, iteration, byte length, digest(암호화) method, callback 함수
     */
    crypto.pbkdf2(pw, salt, 256, 32, "sha512", (err, key) => {
      if (err) {
        throw err;
      }

      const hashPassword = key.toString("base64"); //salt와 암호화된 최종 pw
      const UEQuery = `INSERT INTO user_encrypt (No, id, pw, salt) VALUE (${No}, ${connection.escape(
        id
      )}, ${connection.escape(hashPassword)}, ${connection.escape(salt)})`;
      connection.query(UEQuery, (err, rows, fields) => {
        if (err) {
          throw err;
        }
      });
    });
  });
  res.json({ result: true });
};

module.exports = {
  getUserInfo,
  insertUserInfo,
  insertUserEncrypt,
};

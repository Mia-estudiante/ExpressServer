"use strict";

const { user_info, user_encrypt } = require("../models/index");
const crypto = require("crypto");

/**
 * 목적) 가입하는 회원의 회원번호를 부여하기 위해
 * @returns 부여할 회원번호
 */
const newNo = function () {
  return user_info
    .findAll({
      attributes: [
        [
          user_info.sequelize.fn("COUNT", user_info.sequelize.col("*")),
          "count",
        ],
      ],
    })
    .then((results) => {
      return ++results[0].dataValues.count;
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * user_info 테이블
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const insertUserInfo = async function (req, res, next) {
  //1. 회원번호 부여
  const No = await newNo();

  //2. user_info 테이블 : No, id, name, birth
  await user_info
    .create({
      No: No,
      id: req.body.id,
      name: req.body.name,
      birth: req.body.birth,
    })
    .then((results) => {
      // console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
  next();
};

/**
 * user_encrypt 테이블
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const insertUserEncrypt = async function (req, res, next) {
  const No = await newNo();

  //3. user_encrypt - id, pw, salt 기록 => 64바이트
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
    crypto.pbkdf2(req.body.pw, salt, 256, 32, "sha512", (err, key) => {
      if (err) {
        throw err;
      }

      const hashPassword = key.toString("base64"); //salt와 암호화된 최종 pw

      user_encrypt
        .create({ No: No, id: req.body.id, pw: hashPassword, salt: salt })
        .then((results) => {
          // console.log(results);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
  res.json({ result: true });
};

module.exports = {
  insertUserInfo,
  insertUserEncrypt,
};

"use strict";

const { user_info, user_encrypt } = require("../models/index");
const crypto = require("crypto");

/**
 * 1. 비밀번호 확인 전, 아이디 존재 확인
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkID = (req, res, next) => {
  user_info
    .findOne({
      attribute: ["id"],
      where: { id: req.body.id },
    })
    .then((results) => {
      results ? next() : res.json({ result: false });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * 2. 비밀번호 확인 및 매칭
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkPW = async (req, res, next) => {
  console.log("등록된 아이디");

  let hashPassword, salt;
  /**
   * 1) user_encrypt 내 저장된 해시 비밀번호와 솔트 찾기
   */
  await user_encrypt
    .findAll({
      attributes: ["pw", "salt"],
      where: { id: req.body.id },
    })
    .then((results) => {
      hashPassword = results[0].dataValues.pw;
      salt = results[0].dataValues.salt;
    })
    .catch((err) => {
      console.log(err);
    });

  /**
   * 2) 연산을 통해 req.body.pw와 hashPassword의 일치 여부 확인
   *  - req.body.pw: 사용자가 입력한 패스워드
   *  - hashPassword: DB에 등록된 패스워드
   */
  crypto.pbkdf2(req.body.pw, salt, 256, 32, "sha512", (err, key) => {
    if (err) {
      console.log(err);
    }

    const hash = key.toString("base64"); //사용자가 입력한 패스워드를 salt를 통해 sha512로 암호화한 패스워드
    hashPassword === hash
      ? res.json({ result: true })
      : res.json({ result: false });
  });

  //////salt 변경할 것!!
  // crypto.randomBytes(32, (err, buf) => {
  //   if (err) {
  //     throw err;
  //   }

  //   const newSalt = buf.toString("base64");

  //   /**
  //    *  평문 pw, salt, iteration, byte length, digest(암호화) method, callback 함수
  //    */
  //   crypto.pbkdf2(pw, newSalt, 256, 32, "sha512", (err, key) => {
  //     if (err) {
  //       throw err;
  //     }

  //     const newHashPassword = key.toString("base64"); //salt와 암호화된 최종 pw

  //     user_encrypt
  //       .create({ No: No, id: req.body.id, pw: newHashPassword, salt: newSalt })
  //       .then((results) => {
  //         console.log(results);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });
  // });
};

module.exports = {
  checkID,
  checkPW,
};

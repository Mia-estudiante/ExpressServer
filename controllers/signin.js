"use strict";

const { user_info, user_encrypt } = require("../models/index");
const crypto = require("crypto");

let id, pw;
const getUserInfo = (req, res, next) => {
  const request = req.body;
  id = request.id;
  pw = request.pw;
  console.log(id, pw);
  next();
};

/**
 * 1. 비밀번호 확인 전, 아이디 존재 확인
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkID = async (req, res, next) => {
  await user_info
    .findOne({
      attribute: ["id"],
      where: { id: id },
    })
    .then((results) => {
      results ? next() : res.json({ result: false });
    })
    .catch((err) => {
      console.log(err);
    });
};

let hashPassword, salt;
/**
 * 2. 비밀번호 확인 및 매칭
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkPW = async (req, res, next) => {
  console.log("등록된 아이디");
  await user_encrypt
    .findAll({
      attributes: ["pw", "salt"],
      where: { id: id },
    })
    .then((results) => {
      hashPassword = results[0].dataValues.pw;
      salt = results[0].dataValues.salt;
    })
    .catch((err) => {
      console.log(err);
    });

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
};

module.exports = {
  getUserInfo,
  checkID,
  checkPW,
};

"use strict";

const { user_info, user_encrypt } = require("../models/index");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const redis = require("redis");
// require("dotenv").config();

function getUID(id) {
  return user_info
    .findOne({
      attribute: ["uid"],
      where: { id: id },
    })
    .then((result) => {
      return result.dataValues.uid;
    })
    .catch((err) => {
      console.log(err);
    });
}

function findPW(id) {
  return user_encrypt
    .findAll({
      attributes: ["pw"],
      where: { id: id },
    })
    .then((results) => {
      return results[0].dataValues.pw;
    })
    .catch((err) => {
      console.log(err);
    });
}

function findSalt(id) {
  return user_encrypt
    .findAll({
      attributes: ["salt"],
      where: { id: id },
    })
    .then((results) => {
      return results[0].dataValues.salt;
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 * 1. 비밀번호 확인 전, 아이디 존재 확인
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkID = (req, res, next) => {
  user_info
    .findOne({
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

  /**
   * 1) user_encrypt 내 저장된 해시 비밀번호와 솔트 찾기
   */
  const hashPassword = await findPW(req.body.id);
  const salt = await findSalt(req.body.id);

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
    hashPassword === hash ? next() : res.json({ result: false });
  });
};

/**
 * 3. user_encrypt 테이블
 * - pw, salt 값 변경
 */
const updateTable = (req, res, next) => {
  const id = req.body.id;
  const pw = req.body.pw;

  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      throw err;
    }

    const newSalt = buf.toString("base64");

    /**
     *  평문 pw, salt, iteration, byte length, digest(암호화) method, callback 함수
     */
    crypto.pbkdf2(pw, newSalt, 256, 32, "sha512", (err, key) => {
      if (err) {
        throw err;
      }

      const newHashPassword = key.toString("base64"); //salt와 암호화된 최종 pw

      user_encrypt
        .update(
          { pw: newHashPassword, salt: newSalt },
          {
            where: { id: id },
          }
        )
        .then((results) => {
          next();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};

const addToken = async (req, res, next) => {
  const uid = await getUID(req.body.id);
  console.log(uid);

  /**
   * uid 기반 토큰 생성
   */
  const accessToken = jwt.sign({ uid: uid }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "3h",
  });

  req.client.set(`${uid}`, accessToken);
  res.cookie("token", accessToken);
  res.json({ result: true });
};

module.exports = {
  checkID,
  checkPW,
  updateTable,
  addToken,
};

"use strict";

const { user_info, user_encrypt } = require("../models/index");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
let jwtObj = {};
jwtObj.secret = "apple"; // 비밀키

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

const makeJWT = (req, res, next) => {
  /**
   * 토큰은 로그인할 때 생성
   * 로그인할 때마다 JWT 발급
   * - DB에 refreshToken 저장 테이블 생성
   * CREATE TABLE refresh_token (
   *    No INT NOT NULL,
   *    id  VARCHAR(150) NOT NULL,
   *    token VARCHAR(100),
   *    PRIMARY KEY(No))
   *
   * CLIENT -> SERVER
   * 1. refreshtoken 존재 확인(보통 2주로 설정)
   *  - 없으면, 발급(SERVER -> CLIENT)
   *  - 있다면, 유효기간 확인
   *    -> 1일 이상이면 그대로 사용
   *    -> 아닌 경우, 새로 발급
   *  - DB에 저장
   *
   * 2. accesstoken 존재 확인
   *  - 없다면, 발급(SERVER -> CLIENT)
   *  - 있다면, 유효기간 확인
   *    -> 1시간 이상이면 그대로 사용
   *    -> 아닌 경우, refreshtoken을 통해 새로 발급
   *
   * CLIENT -> SERVER
   * 3. 발급받은 토큰으로 서버에 재요청
   * 4. 관련 페이지로 이동
   *
   */

  /**
   * refresh token
   * - payload 없이 발급
   */
  const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "14d",
  });

  /**
   * access token
   */
  const accessToken = jwt.sign({ id: req.body.id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "3h",
  });

  // 웹 브라우저(클라이언트)에 토큰 세팅
  res.cookie("accessToken", accessToken);
  res.cookie("refreshToken", refreshToken);
};

module.exports = {
  checkID,
  checkPW,
  updateTable,
  makeJWT,
};

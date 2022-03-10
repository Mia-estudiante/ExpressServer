"use strict";

const nodemailer = require("nodemailer");
const redis = require("redis");
const sanitizeHtml = require("sanitize-html");
require("dotenv").config();

/**
 * 랜덤 인증번호 제작
 * - 4자리 임의의 정수 반환
 */
function getRandomInt() {
  return Math.floor(Math.random() * (10000 - 1000)) + 1000;
}

/**
 * redis 연결
 */
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
});
client.connect();

/**
 * transporter 객체
 * - SMTP 정보
 */
const transporter = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: JSON.parse(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PW,
  },
};

/**
 * 전송할 이메일 정보 제작
 * @param {} to id
 * @returns email_data
 */
function makeData(to) {
  const code = getRandomInt();
  client.set(`${to}`, code); //암호화?

  return {
    from: "administrator@gmail.com",
    to: `${to}`,
    subject: "이메일 인증번호 전송 메일입니다.",
    text: `인증번호는 [ ${code} ]입니다.`,
  };
}

const send = async function (req, res, next) {
  const id = sanitizeHtml(req.body.id);
  const email_data = makeData(id);

  //인증번호 발송
  nodemailer.createTransport(transporter).sendMail(email_data, (err, info) => {
    if (err) {
      console.log(err);
    }
    // console.log(info);
  });

  ////////인증 완료시 확인할 것, 그리고 데이터 낭비를 위해 삭제
  const val = await client.get(`${id}`, redis.print);
  console.log(val);
  ////////////////
  res.json({ code: val });
};

module.exports = {
  send,
};

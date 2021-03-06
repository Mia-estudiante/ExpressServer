"use strict";

const nodemailer = require("nodemailer");
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
function makeData(to, client) {
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
  const email_data = makeData(id, req.client);

  //인증번호 발송
  nodemailer.createTransport(transporter).sendMail(email_data, (err, info) => {
    if (err) {
      res.json({ result: false });
      throw new Error(`The verificode wasn't transmitted!`);
    }
    // console.log(info);
  });

  res.json({ result: true });
};

module.exports = {
  send,
};

"use strict";

const nodemailer = require("nodemailer");

function getRandomInt() {
  //1000<= <10000 사이의 임의의 정수 반환
  return Math.floor(Math.random() * (10000 - 1000)) + 1000;
}

/**
 * SMTP 정보
 */
const email = {
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "3a44f854f50f94",
    pass: "57eefd79dec279",
  },
};

function makeData(to) {
  const code = getRandomInt();
  return {
    from: "administrator@gmail.com",
    to: `${to}`,
    subject: "테스트 메일입니다.",
    text: `인증번호는 [ ${code} ]입니다.`,
  };
}

const send = function (req, res, next) {
  const email_data = makeData(req.body.id);

  nodemailer.createTransport(email).sendMail(email_data, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info);
    res.json({ result: true });
  });
};

module.exports = {
  send,
};

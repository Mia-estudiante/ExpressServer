"use strict";

const connection = require("../app");

const checkValidEmail = function (req, res, next) {
  //1. 이미 존재하는 이메일인가?
  connection.query(emailQuery + `${id}')`, (err, rows, fields) => {
    if (err) {
      throw err;
    }
    const key = Object.keys(rows[0])[0];
    console.log(rows);
    rows[0][key] == 0 ? (isValidEmail = true) : (isValidEmail = false);
    console.log(isValidEmail);
    console.log("checking Before " + isValidEmail); //실행순서 2
  });
  console.log(isValidEmail);
  next(isValidEmail);
};

module.exports = {
  checkValidEmail,
};

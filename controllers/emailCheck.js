"use strict";

const connection = require("../app");

const checkValidEmail = function (req, res, next) {
  //1. 이미 존재하는 이메일인가?
  const emailQuery = `SELECT EXISTS(SELECT * FROM user_info WHERE id='`;
  const id = req.body.data;
  console.log(id);
  let isValidEmail = false;
  connection.query(emailQuery + `${id}')`, (err, rows, fields) => {
    if (err) {
      throw err;
    }
    const key = Object.keys(rows[0])[0];
    rows[0][key] == 0 ? (isValidEmail = true) : (isValidEmail = false);
    res.json({ result: isValidEmail });
  });
};

module.exports = {
  checkValidEmail,
};

"use strict";

const connection = require("../app");

const checkValidEmail = function (req, res, next) {
  //1. 이미 존재하는 이메일인가?
  const emailQuery = `SELECT EXISTS(SELECT * FROM user_info WHERE id=?)`;
  let isValidEmail = false;
  connection.query(emailQuery, [req.body.id], (err, rows, fields) => {
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

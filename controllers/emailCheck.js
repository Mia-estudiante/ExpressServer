"use strict";

const { user_info } = require("../models/index");
const checkValidEmail = function (req, res, next) {
  //1. 이미 존재하는 이메일인가?
  user_info
    .findOne({
      attribute: ["id"],
      where: { id: req.body.id },
    })
    .then((result) => {
      result ? res.json({ result: false }) : res.json({ result: true });
    })
    .catch((err) => {
      throw new Error(
        `The "user_info" table doesn't return "checkValidEmail" result!`
      );
    });
};

module.exports = {
  checkValidEmail,
};

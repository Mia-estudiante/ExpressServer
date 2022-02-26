"use strict";

const { user_info } = require("../models/index");
const checkValidEmail = async function (req, res, next) {
  //1. 이미 존재하는 이메일인가?
  await user_info
    .findOne({
      attribute: ["id"],
      where: { id: req.body.id },
    })
    .then((results) => {
      results ? res.json({ result: false }) : res.json({ result: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  checkValidEmail,
};

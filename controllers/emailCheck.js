"use strict";

const { user_info } = require("../models/index");
const checkValidEmail = async function (req, res, next) {
  //1. 이미 존재하는 이메일인가?
  const emailQuery = `SELECT EXISTS(SELECT * FROM user_info WHERE id=:id)`;
  const values = {
    id: req.body.id,
  };
  const results = await user_info.sequelize.query(emailQuery, {
    replacements: values,
    type: user_info.sequelize.QueryTypes.SELECT,
  });
  const key = Object.keys(results[0])[0];
  results[0][key] ? res.json({ result: false }) : res.json({ result: true });
};

module.exports = {
  checkValidEmail,
};

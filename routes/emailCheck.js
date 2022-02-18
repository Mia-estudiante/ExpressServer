"use strict";

const express = require("express");
const router = express.Router();
const connection = require("../app");

//1. 이메일 유효 확인
router.post("/emailCheck", (req, res) => {
  //   const request = req.data.body;
  //   console.log(request);
});

module.exports = router;

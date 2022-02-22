"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/emailCheck");

//1. 이메일 유효 확인
router.post("/", controller.checkValidEmail);

module.exports = router;

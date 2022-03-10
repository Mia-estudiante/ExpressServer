"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/checkVerifiCode");

//1. 인증번호 확인
router.post("/", controller.checkVerifiCode, controller.delKey);

module.exports = router;

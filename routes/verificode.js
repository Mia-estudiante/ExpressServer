"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/verificode");

//1. 인증번호 전송
router.post("/", controller.send);

module.exports = router;
